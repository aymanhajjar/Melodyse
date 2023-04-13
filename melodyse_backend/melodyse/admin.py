from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(User)
admin.site.register(UserInfo)
admin.site.register(UserFriend)
admin.site.register(FriendRequest)
admin.site.register(UserRating)
admin.site.register(Project)
admin.site.register(File)
admin.site.register(Task)
admin.site.register(Notification)
admin.site.register(Track)
admin.site.register(TrackComment)