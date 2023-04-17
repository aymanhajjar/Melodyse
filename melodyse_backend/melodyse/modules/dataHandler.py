from ..models import *

def getData(user):
    
    user_info = UserInfo.objects.get(user=user)
    points_remaining = user_info.subscription.points - user_info.points_used 
    user_chats = Chat.objects.filter(project=None, participants=user)


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
        'chats': [chat.serialize() for chat in user_chats],
        'friend_requests': [request.serialize() for request in user.friend_requests.all()],
        'project_invites':[invite.serialize() for invite in user.project_invites.all()]
    }