from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from users.models import UserInfo, Project, User
# Create your views here.
def getData(request):
    if request.user.is_authenticated and request.user.is_admin:
        data = {}
        male_count = UserInfo.objects.filter(gender='M').count()
        female_count = UserInfo.objects.filter(gender='F').count()
        data['users_count'] = {
            'male': male_count,
            'female': female_count,
            'total': User.objects.all().count()
        }
        completed_count = Project.objects.filter(is_completed = True).count()
        notcompleted_count =  Project.objects.filter(is_completed=False).count()
        data['projects_count'] = {
            'completed':  completed_count,
            'notcompleted': notcompleted_count,
            'total': Project.objects.all().count()
        }
        data['projects'] = [{
            'id': prj.id,
            'name': prj.title,
            'owner_username': prj.owner.username,
            'description': prj.description,
            'members': [{
                'name': member.first_name + ' ' + member.last_name,
                'username': member.username, 
                'picture': member.info.get().picture.url} for member in prj.members.all()]
             } for prj in Project.objects.filter(is_completed=False).order_by('-date_started')[:5] ]
        print(data)
        return JsonResponse(data, safe=False)
        
    else:
        return HttpResponse('Not Allowed', status=403)    

def modifyProject(request):
    if request.user.is_authenticated and request.user.is_admin:
        id = request.POST['id']
        type = request.POST['type']
        if type == 'delete':
            Project.objects.filter(id=id).delete()
        if type == 'end':
            Project.objects.filter(id=id).update(is_completed=True)
        return JsonResponse({'status': 'done'}, safe=False)
    else:
        return HttpResponse('Not Allowed', status=403)    
