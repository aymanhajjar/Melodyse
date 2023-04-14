from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField, ArrayField

# Create your models here.
class SubscriptionPlan(models.Model):
    level = models.IntegerField()
    name = models.CharField(max_length=200)
    card_color = models.CharField(max_length=200)
    is_popular = models.BooleanField()
    number_of_users = models.BigIntegerField()
    price_per_month = models.IntegerField()
    max_personal_projects = models.IntegerField()
    points = models.IntegerField()
    tag_on_profile = models.CharField(max_length=100)
    profile_color = models.CharField(max_length=200, blank=True)
    features = ArrayField(models.CharField(max_length=200))
    
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

class UserInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="info")
    date_of_birth = models.DateField()

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    favorite_artists = ArrayField(JSONField(), blank=True)
    favorite_songs = ArrayField(JSONField(), blank=True)
    picture = models.ImageField(upload_to='profile_pictures/')
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    subscription = models.ForeignKey(SubscriptionPlan, related_name="users", default=0, to_field='level')
    subscription_started = models.DateTimeField(auto_now_add=True)
    points_used = models.IntegerField(default=0)

class UserFriend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    date_accepted = models.DateTimeField(auto_now_add=True)


class FriendRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend_requests")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)

class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    target_user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()

class Project(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    date_started = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    is_collab = models.BooleanField()
    is_completed = models.BooleanField(default=False)
    members = models.ManyToManyField(User, on_delete=models.CASCADE, related_name="projects_active")

class ProjectInvite(models.Model):
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invites_sent")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="project_invites")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="invites")
    is_collab = models.BooleanField()
    offered_amount = models.IntegerField(blank=True)
    is_accepted = models.BooleanField(default=False)

class File(models.Model):
    file = models.FileField(upload_to='project_files/')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploaded_files")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="files")

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    target_user = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="assigned_tasks")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    is_milestone = models.BooleanField(default=False)
    payout = models.IntegerField(blank=True)

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    target_user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

class Track(models.Model):
    track = models.FileField(upload_to='user_tracks/')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracks")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tracks", blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    number_of_plays = models.BigIntegerField(default=0)
    is_personal = models.BooleanField()
    likes = models.ManyToManyField(User, on_delete=models.CASCADE, related_name="likes")

class TrackComment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

class Chat(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_admin")
    participants = models.ManyToManyField(User, related_name='chats', related_name = "chats")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="chat", blank=True)
    created = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
