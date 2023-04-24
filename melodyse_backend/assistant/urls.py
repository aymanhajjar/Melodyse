from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("improve", views.Improve),
    path("feedback", views.Feedback),
    path("grammar", views.Grammar),
    path("generate", views.Generate),
    path("generatemelody", views.GenerateMelody),
]
