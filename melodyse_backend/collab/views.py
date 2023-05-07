from rest_framework.pagination import PageNumberPagination
from users.models import User, UserInfo, ProjectInvite, Project, Task, File, Track, Chat
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from . import findMatch
from django.db.models import Q
import json
from django.db.models import Sum

class UsersPagination(PageNumberPagination):
    page_size = 9
    page_query_param = 'page'
    page_size_query_param = 'page_size'
    max_page_size = 9

class UsersView(APIView):
    pagination_class = UsersPagination()  

    def get(self, request):
        is_VIP = False
        is_PLUS = False
        rating = False
        skill = False
        q = False
        try:
            is_VIP = request.GET['is_vip']
        except:
            pass

        try:
            is_PLUS = request.GET['is_plus']
        except:
            pass

        try:
            rating = request.GET['rating']
        except:
            pass

        try:
            skill = request.GET['skill']
        except:
            pass

        try:
            q = request.GET['q']
        except:
            pass

        if request.user.is_authenticated:
            matches = findMatch.get(request.user.id)
            users = []
            kwargs = {}
            if is_VIP:
                kwargs['subscription__level'] = 2
            if is_PLUS:
                kwargs['subscription__level'] = 1
            if is_PLUS and is_VIP:
                del kwargs['subscription__level']
                kwargs['subscription__level__in'] = [1,2]
            if rating:
                kwargs['rating__gt'] = int(rating)-1
            if skill:
                kwargs['user__skills__skill__name'] = skill
            if q:
                kwargs['user__username__icontains'] = q 

            for id in matches:
                kwargs['user__id'] = id
                
                model = UserInfo.objects.filter(**kwargs).first()
                if model is not None:
                    serialized = model.serialize()
                    serialized['is_match'] = True
                    users.append(serialized)

            others = UserInfo.objects.filter(
                    ~Q(user__id__in=matches),
                    ~Q(user__id=request.user.id),
                    Q(subscription__level=2) if is_VIP else Q() | Q(subscription__level=1) if is_PLUS else Q(),
                    Q(rating__gt=int(rating)-1) if rating else Q(),
                    Q(user__skills__skill__name=skill) if skill else Q(),
                    Q(user__username__icontains=q) if q else Q()
                )
            
            for user in others:
                try:
                    users.append(user.serialize())
                except:
                    pass
            page = self.pagination_class.paginate_queryset(users, request)
            
            return Response(page)
            
        else:
            users = UserInfo.objects.all()
            page = self.pagination_class.paginate_queryset(users, request)
            return Response([user.serialize() for user in page])
        
def sendInvite(request):
    if request.user.is_authenticated:
        type = request.POST['type']
        exists = request.POST['exists']
        username = request.POST['username']
        name = request.POST['project_name']
        description = request.POST['project_description']
        if type == 'hire':
            amount = request.POST['offered_amount']
        else:
            amount = None
        message = request.POST['message']

        is_collab = True if type == 'collab' else False

        try:
            recipient = User.objects.get(username=username)
        except User.DoesNotExist:
            return HttpResponse('User not found', status=404)
        
        project = Project.objects.create(owner=request.user, title=name, description=description, is_collab=is_collab)
        chat = Chat.objects.create(admin=request.user, paricipants=request.user, project=project)
        project.members.add(request.user)
        project.members.add(recipient)

        ProjectInvite.objects.create(initiator=request.user, recipient=recipient, is_collab=is_collab, project=project, message=message, offered_amount=amount)

        return JsonResponse({'status': 'invite sent'})
        
    else:
        return HttpResponse('User not logged in', status=403)
    
def getProject(request, id):
    if request.user.is_authenticated:
        try:
            project = Project.objects.get(id=id, members=request.user)
            serialized = project.serialize()
            if not project.is_collab:
                total = ProjectInvite.objects.filter(project=project).aggregate(Sum('offered_amount'))['offered_amount__sum']
                serialized['payout'] = total
            return JsonResponse(serialized, safe=False)
        except:
            return HttpResponse('Not Allowed', status=403)
    else:
        return HttpResponse('User not logged in', status=403)
    
def updateTasks(request):
    if request.user.is_authenticated:
        id = request.POST['id']
        tasks_array = request.POST.get('tasks')
        tasks = json.loads(tasks_array)
        project = Project.objects.get(id=id, members=request.user)
        if project.owner == request.user:
            order = 0
            for task in tasks:
                try:
                    if task['id']:
                        oldtask = project.tasks.get(id=task['id'])
                        oldtask.order = order
                        oldtask.is_completed = task['is_completed']
                        oldtask.save()
                        order = order + 1
                    else:
                        target_user = User.objects.get(username=task['target_username'])
                        Task.objects.create(project=project, target_user=target_user, name=task['name'], description=task['description'], order=order)
                except Project.DoesNotExist:
                    target_user = User.objects.get(username=task['target_username'])
                    Task.objects.create(project=project, target_user=target_user, name=task['name'], description=task['description'], order=order)

            return JsonResponse({'status': 'tasks updated'})
        else:
            return HttpResponse('Not Allowed', status=403)
    else:
        return HttpResponse('User not logged in', status=403)
    
def removeTask(request):
    if request.user.is_authenticated:
        id = request.POST['id']
        task = Task.objects.get(id=id)
        task.delete()

        return JsonResponse({'status': 'task deleted'})
    else:
        return HttpResponse('User not logged in', status=403)
    
def addTask(request):
    if request.user.is_authenticated:
        id = request.POST['id']
        task_json = request.POST['task']
        task = json.loads(task_json)
        project = Project.objects.get(id=id, members=request.user)
        target_user = User.objects.get(username=task['target_username'])
        newtask = Task.objects.create(project=project, target_user=target_user, name=task['name'], description=task['description'], order=0)

        return JsonResponse(newtask.serialize(), safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def downloadFile(request, id):
    if request.user.is_authenticated:
        file = File.objects.get(id=id)
        project = file.project
        if project.members.filter(pk=request.user.pk).exists():
            response = HttpResponse(file.file, content_type='application/force-download')
            response['Content-Disposition'] = f'attachment; filename="{file.file.name}"'
            return response
        else:
            return HttpResponse('Not Allowed', status=403)
    else:
        return HttpResponse('User not logged in', status=403)
    
def endProject(request):
    if request.user.is_authenticated:
        id = request.POST['id']
        project = Project.objects.get(id=id, members=request.user)
        if project.owner == request.user:
            project.is_completed = True
            project.save()

            return JsonResponse({'status': 'done'})

        return HttpResponse('Not allowed', status=403)

    else:
        return HttpResponse('User not logged in', status=403)
    
def uploadProject(request):
    if request.user.is_authenticated:
        id = request.POST['id']
        song = request.FILES.get('file')
        project = Project.objects.get(id=id, members=request.user)
        if project.owner == request.user:
            project.is_completed = True
            project.save()
            Track.objects.create(track=song, owner=request.user, project=project, name=project.title)
            return JsonResponse({'status': 'done'})

        return HttpResponse('Not allowed', status=403)

    else:
        return HttpResponse('User not logged in', status=403)
    
def getMyProjects(request):
    if request.user.is_authenticated:
        projects = Project.objects.filter(members=request.user)
        completed_projects = []
        ongoing_projects = []
        for project in projects:
            serialized_project = project.serialize()
            if project.is_completed:
                completed_projects.append(serialized_project)
            else:
                ongoing_projects.append(serialized_project)
        
        response_data = {'completed': completed_projects, 'ongoing': ongoing_projects}
        return JsonResponse(response_data)

    else:
        return HttpResponse('User not logged in', status=403)
    
def getAllProjects(request):
    if request.user.is_authenticated:
        projects = Project.objects.filter(~Q(members=request.user) & Q(is_completed=False))
        return JsonResponse([prj.serialize() for prj in projects], safe=False)
    else:
        return HttpResponse('User not logged in', status=403)