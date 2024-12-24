from django.shortcuts import render, HttpResponse

import os

# Create your views here.

def home(request):
    return HttpResponse("Hello, world. You're in cafeService View/Home.")

def about(request):
    return HttpResponse("Hello, Your are in CafeService views/about...")