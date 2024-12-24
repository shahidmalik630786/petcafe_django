from django.contrib import admin
from django.urls import path, include, re_path
from cafeService import views

urlpatterns = [
    path('cafe', views.home, name='home'),
    path('About', views.about, name='about')
]
