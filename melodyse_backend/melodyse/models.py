from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField, ArrayField

# Create your models here.
class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

class UserInfo(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="info")
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



