from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("login", views.userLogin),
    path("logout", views.logout),
    path("register", views.register),
    path("checkusername", views.checkUsername),
    path("gettoken", views.getToken),
    path("getinfo", views.getInfo),
    path("getmessages", views.getChats)
]
