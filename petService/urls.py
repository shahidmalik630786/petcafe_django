from django.contrib import admin
from django.urls import path, include, re_path
from petService import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home, name='home'),    
    path('about', views.about, name='about'),
    path('book', views.book, name="book"),
    path('bookmyslot', views.bookmyslot, name="bookmyslot"),
    path('offer', views.offer, name='offer'),
    path('contact', views.contact, name='contact'),
    path('termsnconditions', views.terms, name="terms"),
    path('message', views.get_message, name='sendMessage'),
    path('schedule_vet', views.vet_assist, name='vet_assist'),
    path('train', views.pet_training, name="petTrain"),
    path('board', views.pet_boarding, name="petBoard"),
    path('bangalore_boarding', views.bangalore_boarding, name="bangalore_boarding"),
    path('pet_service', views.pet_service_bangalore, name="pet_service_bangalore"),
    
    path('generateBill/<int:id>', views.generateBill, name="generateBill"),
    path('editPetDetails/<int:id>', views.edit_details, name="editDetails"),
    path('updateData/<int:id>', views.update_details, name="update_details"),
    path('gallery', views.galleries, name="gallery"),
    path('partnership', views.partnership, name="partnership"),
    path('policies',views.policies, name="policies"),
    path('pet_breed', views.pet_breed, name="pet_breed"),
    path('fetch_test', views.fetch_test_details, name="fetch_test"),
    path('partnership/status/', views.partnership_status, name="partnership_status"),

    #Admin
    path('fetch/', views.fetch_details, name="fetch"),
    path('partnership_admin/', views.partnership_admin, name="partnership_admin"),
    path('staff/', views.staff, name="staff"),
    path('cafe_admin/', views.cafe_admin, name="cafe_admin"),


    #API
    path('api/partnership', views.partnershipView, name="partnership_form_submit"),
    path('api/get/partnership', views.PartnershipView.as_view(), name="partnership_get_data"),
    path('api/get/cafe', views.CafeView.as_view(), name="cafe_get_data"),
    path('api/get/partnership/<int:pk>/', views.AdminPartnershipView.as_view(), name="get_partnership_data"),
    path('api/put/partnership/<int:pk>/', views.AdminPartnershipView.as_view(), name="update_partnership_data"),

]
