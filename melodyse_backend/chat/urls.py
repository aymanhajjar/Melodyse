from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("getchat", views.ChatView.as_view()),
    path("uploadfile", views.uploadFile)
]
