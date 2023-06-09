from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.core.exceptions import ValidationError
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.password_validation import validate_password
from .models import *
import json
from django.db.models import Max
from .modules import dataHandler
from .modules import helpers
from django.db.models import Q
from google.oauth2 import id_token
from google.auth.transport import requests
from django.db.models import Sum
import environ
import requests as requests_py
from django.core.files.base import ContentFile
from datetime import datetime
# Create your views here.

env = environ.Env()
environ.Env.read_env()

def getToken(request):
    response = JsonResponse({'status': 'success'})
    response['X-CSRFToken'] = get_token(request)
    return response

def userLogin(request):
    username_email = request.POST['username_email']
    password = request.POST['password']
    try:
        google_id_token = request.POST['google_id_token']
    except:
        google_id_token = False

    user = authenticate(request, username=username_email, password=password)

    if user is not None:
        login(request, user)
        if google_id_token:
            id_info = id_token.verify_oauth2_token(google_id_token, requests.Request())
            user.google_id = id_info['sub']
            user.save()

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

def googleSignIn(request):
    data = json.loads(request.POST['response'])
    token = data['zc']['id_token']
    id_info = id_token.verify_oauth2_token(token, requests.Request())
    if id_info['aud'] != env('GOOGLE_CLIENT_ID'):
        raise ValueError('Invalid client ID')
    
    if datetime.fromtimestamp(id_info['exp']) <= datetime.utcnow():
        raise ValueError('ID token has expired')
    
    google_id = id_info['sub']

    if User.objects.filter(email=data['wv']['iw']).exists():
        user = User.objects.get(email=data['wv']['iw'])
        if user.google_id:
            if user.google_id == google_id:
                login(request, user, backend='users.modules.auth.AuthBackend')
                user_data = dataHandler.getData(user)
                return JsonResponse(user_data)
            else:
                return HttpResponse('Failed to verify user', status=401)
        else:
            return HttpResponse('password required for: ' + user.email , status=400)
    else:
        new_username = data['wv']['ZZ'].lower().replace(" ", "") + data['wv']['pY'].lower().replace(" ", "")

        i = 2

        while User.objects.filter(username=new_username).exists():
            new_username = data['wv']['ZZ'].lower().replace(" ", "") + data['wv']['pY'].lower().replace(" ", "") + str(i)
            i += 1

        user = User.objects.create_user(username=new_username, email=data['wv']['iw'], first_name=data['wv']['ZZ'], last_name=data['wv']['pY'], google_id=google_id)

        url = data['wv']['QO']
        response = requests_py.get(url)
        image_data = response.content

        info = UserInfo.objects.create(user=user)
        info.picture.save(new_username + '.jpg', ContentFile(image_data), save=True)

        login(request, user, backend='users.modules.auth.AuthBackend')
        
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
            'projects': [invite.serialize() for invite in request.user.project_invites.all()],
            'join': [req.serialize() for req in request.user.join_requests.all()]
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
        genres = []
        artists = json.loads(request.POST['artists'])
        UserInfo.objects.filter(user=request.user).update(favorite_artists = artists)
        if artists:
            for artist in artists:
                for genre in artist['genres']:
                    genres.append(genre)
            info = UserInfo.objects.get(user=request.user)
            info.favorite_genres = genres
            info.save()
            helpers.addtoDataset(request.user.id, genres)

        return JsonResponse({'status': 'success'})
    else:
        return HttpResponse('User not logged in', status=403)

def addSongs(request):
    if request.user.is_authenticated:
        songs = json.loads(request.POST['songs'])
        UserInfo.objects.filter(user=request.user).update(favorite_songs = songs)
        if songs:
            genres = helpers.extractGenres(songs)
            info = UserInfo.objects.get(user=request.user)
            info.favorite_genres = genres
            info.save()
            helpers.addtoDataset(request.user.id, genres)
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
    total_likes = Track.objects.filter(owner=user).aggregate(total_likes=Sum('likes'))['total_likes']
    serialized['total_likes'] = total_likes
    if request.user.is_authenticated:
        if username == request.user.username:
            serialized['can_edit'] = True
        else:
            serialized['can_edit'] = False
        try:
            friend_request = FriendRequest.objects.get(user=user, sender=request.user, is_accepted=None)
            serialized['requested'] = True
        except:
            pass
        if UserFriend.objects.filter(user=request.user, friends=user).exists():
            serialized['is_friend'] = True

    else:
        serialized['can_edit'] = False
    return JsonResponse(serialized, safe=False)

def searchFriends(request):
    query = request.GET['q']
    friends = UserFriend.objects.get(user=request.user)
    return JsonResponse(friends.search(query), safe=False)

def changePic(request):
    if request.user.is_authenticated:
        picture = request.FILES.get('picture')
        user_info = UserInfo.objects.get(user=request.user)
        if picture:
            user_info.picture = picture
            user_info.save()
        pic_url = user_info.picture.url
        return JsonResponse({'url': pic_url})
    else:
        return HttpResponse('User not logged in', status=403)

def changeName(request):
    if request.user.is_authenticated:
        name = request.POST['name']
        user = User.objects.get(id=request.user.id)
        if name:
            user.first_name = name.split(' ')[0]
            user.last_name = name.split(' ')[1]
            user.save()
        return JsonResponse({'name': name})
    else:
        return HttpResponse('User not logged in', status=403)
    
def changeUsername(request):
    if request.user.is_authenticated:
        username = request.POST['username']
        user = User.objects.get(id=request.user.id)
        if username:
            if User.objects.filter(username=username).exists():
                return HttpResponse('username taken', status=400)   
            else:
                user.username = username
                user.save()
                return JsonResponse({'username': username})
    else:
        return HttpResponse('User not logged in', status=403)
    
def changeDescription(request):
    if request.user.is_authenticated:
        description = request.POST['description']
        user = UserInfo.objects.get(user=request.user)
        if description:
            user.description = description
            user.save()
        return JsonResponse({'description': description})
    else:
        return HttpResponse('User not logged in', status=403)