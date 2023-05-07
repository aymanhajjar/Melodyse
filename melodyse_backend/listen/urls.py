from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("gettracks", views.getTracks.as_view()),
    path("getartists", views.getArtists),
    path("search", views.search),
    path("liketrack", views.likeTrack),
]
