from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField, ArrayField

# Create your models here.
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
    favorite_artists = ArrayField(JSONField())
    favorite_songs = ArrayField(JSONField())
    picture = models.ImageField(upload_to='profile_pictures/')
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    subscription_level = models.IntegerField(default=0)
    subscription_started = models.DateTimeField(auto_now_add=True)
    actions_used = models.IntegerField(default=0)

class UserFriend(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friend_of')
    date_accepted = models.DateTimeField(auto_now_add=True)


class FriendRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="requests")
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

