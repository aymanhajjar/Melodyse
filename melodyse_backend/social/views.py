from django.shortcuts import render
from users.models import FriendRequest, ProjectInvite, User, UserInfo, UserFriend, Notification
from django.http import JsonResponse, HttpResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
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
            
            notf_title = req.user.first_name + ' accepted your friend request!'
            notf_content = req.user.first_name + ' ' + req.user.last_name + ' (@' + req.user.username + ') has accepted your friend request. You are now friends!'
            Notification.objects.create(user=req.sender, title=notf_title, content=notf_content, target_user=req.user)
            count = Notification.objects.filter(user=req.sender, is_read=False).count()

            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                str(req.sender.id),
                {
                    'type': 'new_notf',
                    'count': count
                }
            )

            return JsonResponse({'status': 'added'})
        else:
            req = FriendRequest.objects.get(id=id)
            req.is_accepted = False
            req.save()
            return JsonResponse({'status': 'rejected'})
        
def requestFriend(request):
    if request.user.is_authenticated:
        action = request.POST['action']
        username = request.POST['username']

        if action == 'add':
            target_user = User.objects.get(username=username)
            FriendRequest.objects.create(user=target_user, sender=request.user)

            channel_layer = get_channel_layer()
            count = FriendRequest.objects.filter(user=target_user, is_seen=False).count()
            async_to_sync(channel_layer.group_send)(
                str(target_user.id),
                {
                    'type': 'new_friend',
                    'count': count
                }
            )
            return JsonResponse({'status': 'added'})

        if action == 'remove':
            target_user = User.objects.get(username=username)
            FriendRequest.objects.delete(user=target_user, sender=request.user)
            return JsonResponse({'status': 'removed'})
    
    else:
        return HttpResponse('User not logged in', status=403)