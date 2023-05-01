from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.password_validation import validate_password
from .models import *
import json
from django.db.models import Max
from .modules import dataHandler
from django.db.models import Q

# Create your views here.

def getToken(request):
    response = JsonResponse({'status': 'success'})
    response['X-CSRFToken'] = get_token(request)
    return response

def userLogin(request):
    username_email = request.POST['username_email']
    password = request.POST['password']

    user = authenticate(request, username=username_email, password=password)

    if user is not None:
        login(request, user)

        user_data = dataHandler.getData(user)

        return JsonResponse(user_data)
    
    else:
        return HttpResponse('User not found', status=404)
    
def logoutUser(request):
    logout(request)
    return JsonResponse({'status': 'user logged out'})

def checkUsername(request):
    username = request.POST['username']
    if User.objects.filter(username=username).exists():
        return JsonResponse({'status' : 'not available'})
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

    UserInfo.objects.create(user=user, gender=gender, date_of_birth=date_of_birth)

    user.backend = 'django.contrib.auth.backends.ModelBackend'

    login(request, user)
        
    user_data = dataHandler.getData(user)
    
    return JsonResponse(user_data)

def getInfo(request):
    if request.user.is_authenticated:
        user_data = dataHandler.getData(request.user)
        return JsonResponse(user_data)
    else:
        return HttpResponse('User not logged in', status=403)

def getChats(request):
    if request.user.is_authenticated:
        user_chats = Chat.objects.filter(project=None, participants=request.user).annotate(latest_message_date=Max('messages__date_created')).order_by('-latest_message_date')
        chats = []
        for chat in user_chats:

            serialized = chat.serialize()

            serialized['number_unread'] = Message.objects.filter(chat=chat, is_read=False).exclude(author=request.user).count()

            serialized['participant'] = ', '.join([participant.first_name + ' ' + participant.last_name for participant in chat.participants.all().exclude(id=request.user.id)])

            serialized['participant_img'] = chat.participants.exclude(id=request.user.id).first().info.get().picture.url
            chats.append(serialized)

            serialized['user_id'] = request.user.id

        return JsonResponse(chats, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def getNotifications(request):
    if request.user.is_authenticated:
        notifications = [notf.serialize() for notf in request.user.notifications.all().order_by('-date_created')]
        Notification.objects.filter(user=request.user).update(is_read=True)
        return JsonResponse(notifications, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def getRequests(request):
    if request.user.is_authenticated:
        requests = {
            'friends': [request.serialize() for request in request.user.friend_requests.all()],
            'projects': [invite.serialize() for invite in request.user.project_invites.all()]
        } 
        FriendRequest.objects.filter(user=request.user).update(is_seen=True)
        ProjectInvite.objects.filter(recipient=request.user).update(is_seen=True)

        return JsonResponse(requests, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def getSubscription(request):
    if request.user.is_authenticated:
        user_info = request.user.info.get()
        subscription = request.user.info.get().subscription
        points = subscription.points - user_info.points_used 
        sub = {
            'subscription_plan': subscription.serialize(),
            'points': points
        } 
        return JsonResponse(sub, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def addArtists(request):
    if request.user.is_authenticated:
        artists = json.loads(request.POST['artists'])
        UserInfo.objects.filter(user=request.user).update(favorite_artists = artists)
        return JsonResponse({'status': 'success'})
    else:
        return HttpResponse('User not logged in', status=403)

def addSongs(request):
    if request.user.is_authenticated:
        songs = json.loads(request.POST['songs'])
        UserInfo.objects.filter(user=request.user).update(favorite_songs = songs)
        return JsonResponse({'status': 'success'})
    else:
        return HttpResponse('User not logged in', status=403)
    
def getFavoriteArtists(request):
    if request.user.is_authenticated:
        info = UserInfo.objects.get(user=request.user)
        artists = info.favorite_artists
        return JsonResponse(artists, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def getFavoriteSongs(request):
    if request.user.is_authenticated:
        info = UserInfo.objects.get(user=request.user)
        songs = info.favorite_songs
        return JsonResponse(songs, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def getSkills(request):
    queryset = Skill.objects.all()
    skills = [{'name': skill.name, 'picture': skill.picture.url} for skill in queryset]
    return JsonResponse(skills, safe=False)

def addSkills(request):
    if request.user.is_authenticated:
        skills = json.loads(request.POST['skills'])
        for skill in skills:
            skillObject = Skill.objects.get(name=skill['name'])
            UserSkill.objects.update_or_create(user=request.user, skill=skillObject, defaults={'rating': skill['rating']})
        return JsonResponse({'status': 'success'})
    else:
        return HttpResponse('User not logged in', status=403)
    
def getChosenSkills(request):
    if request.user.is_authenticated:
        skills = UserSkill.objects.filter(user=request.user)
        skillsObject = [skill.serialize() for skill in skills]
        return JsonResponse(skillsObject, safe=False)
    else:
        return HttpResponse('User not logged in', status=403)
    
def getSubscriptions(request):
    subs = SubscriptionPlan.objects.all()
    subsArray = [sub.serialize() for sub in subs]
    return JsonResponse(subsArray, safe=False)

def getProfile(request, username):
    user = User.objects.get(username=username)
    info = UserInfo.objects.get(user = user)
    serialized = info.serialize()
    if request.user.is_authenticated:
        if username == request.user.username:
            serialized['can_edit'] = True
        else:
            serialized['can_edit'] = False
    else:
        serialized['can_edit'] = False
    return JsonResponse(serialized, safe=False)

def searchFriends(request):
    query = request.GET['q']
    friends = UserFriend.objects.get(user=request.user)
    return JsonResponse(friends.search(query), safe=False)

def changePic(request):
    picture = request.FILES.get('picture')
    user_info = UserInfo.objects.get(user=request.user)
    if picture:
        user_info.picture = picture
        user_info.save()
    pic_url = user_info.picture.url
    return JsonResponse({'url': pic_url})

