from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("login", views.userLogin),
    path("logout", views.logoutUser),
    path("register", views.register),
    path("checkusername", views.checkUsername),
    path("gettoken", views.getToken),
    path("getinfo", views.getInfo),
    path("getchats", views.getChats),
    path("getnotifications", views.getNotifications),
    path("getrequests", views.getRequests),
    path("getsubscription", views.getSubscription),
    path("addartists", views.addArtists),
    path("addsongs", views.addSongs),
    path("getfavoriteartists", views.getFavoriteArtists),
    path("getfavoritesongs", views.getFavoriteSongs),
    path("getskills", views.getSkills),
    path("addskills", views.addSkills),
    path("getchosenskills", views.getChosenSkills),
]
