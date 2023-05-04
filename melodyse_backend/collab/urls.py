from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("getmusicians", views.UsersView.as_view()),
    path("send-invite", views.sendInvite),
    path("get-project/<int:id>", views.getProject),
    path("change-tasks", views.changeTasks),
]
