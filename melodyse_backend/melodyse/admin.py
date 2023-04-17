from django.contrib import admin
from .models import *
from django.contrib.postgres.fields import ArrayField
from django import forms
# Register your models here.

class SubscriptionPlanForm(forms.ModelForm):
    features = forms.CharField(widget=forms.Textarea)

    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class SubscriptionPlanAdmin(admin.ModelAdmin):
    form = SubscriptionPlanForm

admin.site.register(SubscriptionPlan, SubscriptionPlanAdmin)
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
admin.site.register(Chat)
admin.site.register(Message)