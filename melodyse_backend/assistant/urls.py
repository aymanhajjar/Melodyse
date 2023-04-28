from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("improve", views.improve),
    path("feedback", views.feedback),
    path("grammar", views.grammar),
    path("generate", views.generate),
    path("generatemelody", views.generateMelody),
    path("buildsound", views.buildSound),
    path("findbass", views.findBass),
    path("gettips", views.getTips),
    path("songstolearn", views.songsToLearn),
    path("suggestresources", views.suggestResources),
]
