from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("getmusicians", views.UsersView.as_view()),
    path("send-invite", views.sendInvite),
    path("join-request", views.joinRequest),
    path("get-project/<int:id>", views.getProject),
    path("update-tasks", views.updateTasks),
    path("add-task", views.addTask),
    path("downloadfile/<int:id>", views.downloadFile),
    path('endproject', views.endProject),
    path('leaveproject', views.leaveProject),
    path('uploadproject', views.uploadProject),   
    path('getmyprojects', views.getMyProjects),   
    path('getallprojects', views.getAllProjects),   
    path('accept-request', views.acceptRequest),   
    path('accept-invite', views.acceptInvite),   
]
