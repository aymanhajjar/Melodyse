from ..models import *

def getData(user):
    
    user_info = UserInfo.objects.get(user=user)
    points_remaining = user_info.subscription.points - user_info.points_used 
    unread_chats = Chat.objects.filter(participants=user, messages__is_read=False).exclude(messages__author=user).count()
    notification_count = Notification.objects.filter(user=user, is_read=False).count()

    return {
        'status': 'success',
        'user_id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'pic': user_info.picture.url,
        'points_remaining': points_remaining,
        'subscription_level': user_info.subscription.level,
        'subscription_name': user_info.subscription.name,
        'notifications': [notf.serialize() for notf in user.notifications.all()],
        'chats': unread_chats,
        'friend_requests': [request.serialize() for request in user.friend_requests.all()],
        'project_invites':[invite.serialize() for invite in user.project_invites.all()]
    }