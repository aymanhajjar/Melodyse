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
            print(str('gtsssss' + str(req.sender.id)))
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