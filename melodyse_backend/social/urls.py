from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("respond-request", views.respondRequest),
    path("request-friend", views.requestFriend),
]
