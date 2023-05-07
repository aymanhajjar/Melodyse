from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from . import views

urlpatterns = [
    path("getdata", views.getData),
    path("modify-project", views.modifyProject),
]
