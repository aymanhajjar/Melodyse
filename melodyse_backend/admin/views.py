from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from users.models import UserInfo, Project
# Create your views here.
def getData(request):
    if request.user.is_authenticated and request.user.is_admin:
        data = {}
        male_count = UserInfo.objects.filter(gender='Male').count()
        female_count = UserInfo.objects.filter(gender='Female').count()
        data['genders_count'] = {
            'male': male_count,
            'female': female_count
        }
        completed_count = Project.objects.filter(is_completed = True).count()
        notcompleted_count =  Project,object.filter(is_completed=False).count()
        data['projects_count'] = {
            'completed':  completed_count,
            'notcompleted': notcompleted_count,
        }
    else:
        return HttpResponse('Not Allowed', status=403)    