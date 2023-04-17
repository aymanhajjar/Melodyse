from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField
from django.core import serializers

# Create your models here.
class SubscriptionPlan(models.Model):
    level = models.IntegerField(unique=True)
    name = models.CharField(max_length=200)
    card_color = models.CharField(max_length=200)
    is_popular = models.BooleanField()
    number_of_users = models.BigIntegerField(default=0)
    price_per_month = models.IntegerField()
    max_personal_projects = models.IntegerField()
    max_active_projects = models.IntegerField(default=0)
    points = models.IntegerField()
    tag_on_profile = models.CharField(max_length=100, blank=True)
    profile_color = models.CharField(max_length=200, blank=True)
    features = ArrayField(models.CharField(max_length=200))
    def __str__(self):
        return self.name
    
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.username

class UserInfo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="info")
    date_of_birth = models.DateField()

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    favorite_artists = ArrayField(JSONField(), blank=True, null=True)
    favorite_songs = ArrayField(JSONField(), blank=True, null=True)
    picture = models.ImageField(upload_to='profile_pictures/',default='profile_pictures/avatar.png')
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    subscription = models.ForeignKey(SubscriptionPlan, related_name="users_subscribed", default=0, to_field='level', on_delete=models.CASCADE)
    subscription_started = models.DateTimeField(auto_now_add=True)
    points_used = models.IntegerField(default=0)
    def __str__(self):
        return self.user.username + "'s info"

class UserFriend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    date_accepted = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.user.username + "'s friends"

class FriendRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="friend_requests")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username + "'s friend requests"
    def serialize(self):
        return {
            "sender_id": self.sender.id,
            "sender_name": self.sender.username,
            "sender_picture": self.sender.info.picture.url,
            "is_accepted": self.is_accepted
        }
    
class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    target_user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField()
    def __str__(self):
        return self.user.username + "'s ratings"

class Project(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    date_started = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    is_collab = models.BooleanField()
    picture = models.ImageField(blank=True, upload_to='project_pictures/')
    is_completed = models.BooleanField(default=False)
    members = models.ManyToManyField(User, related_name="projects_active")
    def __str__(self):
        return self.title
    
class ProjectInvite(models.Model):
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invites_sent")
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="project_invites")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="invites")
    message = models.TextField(blank=True)
    is_collab = models.BooleanField()
    offered_amount = models.IntegerField(blank=True)
    is_accepted = models.BooleanField(default=False)
    def __str__(self):
        return self.initiator.username + "'s invite"
    def serialize(self):
        return {
            "sender_id": self.initiator.id,
            "sender_name": self.initiator.username,
            "sender_picture": self.initiator.info.picture.url,
            "project_name": self.project.title,
            "project_id": self.project.id,
            "message": self.message,
            "is_collab": self.is_collab,
            "offered_amount": self.offered_amount,
            "is_accepted": self.is_accepted
        }
    
class File(models.Model):
    file = models.FileField(upload_to='project_files/')
    name = models.CharField(max_length=200, default='File')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="uploaded_files")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="files")
    def __str__(self):
        return self.name + ' in ' + self.project.title

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    target_user = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="assigned_tasks")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    is_milestone = models.BooleanField(default=False)
    payout = models.IntegerField(blank=True)
    def __str__(self):
        return self.name + ' in ' + self.project.title

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=200)
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    target_user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    def __str__(self):
        return self.user.username + "'s notification " + self.title
    def serialize(self):
        return {
            'title': self.title,
            'content': self.content,
            'date': self.date_created,
            'is_read': self.is_read,
            'target_user': self.target_user.id,
            'target_project': self.project.id
        }

class Track(models.Model):
    track = models.FileField(upload_to='user_tracks/')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tracks")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="final_track", blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    number_of_plays = models.BigIntegerField(default=0)
    is_personal = models.BooleanField()
    likes = models.ManyToManyField(User, related_name="likes")
    def __str__(self):
        return self.name

class TrackComment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments_sent")
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.content

class Chat(models.Model):
    admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_admin")
    participants = models.ManyToManyField(User, related_name='chats')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="chat", blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        participants_list = [{'id': p.id, 'username': p.username} for p in self.participants.all()]
        latest_message = self.messages.latest('date_created')
        return {
            'chat_id': self.id,
            'participants': participants_list,
            'latest_message': {
                'author_id': latest_message.author.id,
                'author_username': latest_message.author.username,
                'content': latest_message.content,
                'is_read': latest_message.is_read,
                'date_created': latest_message.date_created
            }
        }

class Message(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages_sent")
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    def __str__(self):
        return self.content
