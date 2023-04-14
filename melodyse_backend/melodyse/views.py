from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.password_validation import validate_password
from .models import *
# Create your views here.

def userLogin(request):
    username_email = request.POST['username_email']
    password = request.POST['password']

    user = authenticate(request, username=username_email, password=password)

    if user is not None:
        login(request, user)
        
        points_remaining = user.info.subscription.points - user.info.points_used 

        response_data = {
            'status': 'success',
            'user_id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'pic': user.info.picture,
            'points_remaining': points_remaining,
            'subscription_level': user.info.subscription.level,
            'subscription_name': user.info.subscription.name,
            'notifications': user.notifications,
            'chats': user.chats.filter(project = None),
            'friend_requests': user.friend_requests,
            'project_invites': user.project_invites
        }

        return JsonResponse(response_data)
    
    else:
        return HttpResponse('User not found', status=404)
    
def logout(request):
    logout(request)
    return JsonResponse({'status': 'user logged out'})

def checkUsername(request):
    username = request.POST['username']
    if User.objects.filter(username=username).exists():
        return HttpResponse('username already exists', status=400)
    else:
        return JsonResponse({'status': 'available'})
    
def register(request):
    username = request.POST['username']
    email = request.POST['email']
    password = request.POST['password']
    first_name = request.POST['first_name']
    last_name = request.POST['last_name']
    gender = request.POST['gender']
    date_of_birth = request.POST['date_of_birth']

    try:
        validate_password(password)
    except ValidationError as e:
        return HttpResponse('failed to validate password', status=400)
    
    if User.objects.filter(username=username).exists():
        return HttpResponse('username already exists', status=400)
    
    if User.objects.filter(email=email).exists():
        return HttpResponse('email already exists', status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)

    user_info = UserInfo.objects.create(user=user, gender=gender, date_of_birth=date_of_birth)

    user.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, user)
        
    points_remaining = user_info.subscription.points - user_info.points_used 

    response_data = {
        'status': 'success',
        'user_id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'pic': user_info.picture.url,
        'points_remaining': points_remaining
    }
    
    return JsonResponse(response_data)





    
