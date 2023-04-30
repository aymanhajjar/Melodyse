from django.shortcuts import render
from users.models import FriendRequest, ProjectInvite, User, UserInfo, UserFriend
from django.http import JsonResponse, HttpResponse

# Create your views here.
def respondRequest(request):
    type = request.POST['type']
    id = request.POST['id']
    action = request.POST['action']

    if type == 'friend':
        if action == 'accept':
            req = FriendRequest.objects.get(id=id)
            req.is_accepted = True
            req.save()
            
            try:
                user1 = UserFriend.objects.get(user=req.user)
            except UserFriend.DoesNotExist:
                user1 = UserFriend.objects.create(user=req.user)
            user1.friends.add(req.sender)
            user1.save()

            try:
                user2 = UserFriend.objects.get(user=req.sender)
            except UserFriend.DoesNotExist:
                user2 = UserFriend.objects.create(user=req.sender)
            user2.friends.add(req.user)
            user2.save()

            return JsonResponse({'status': 'added'})
        else:
            req = FriendRequest.objects.get(id=id).update(is_accepted=False)
            return JsonResponse({'status': 'rejected'})