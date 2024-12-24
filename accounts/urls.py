from django.contrib import admin
from django.urls import path, include, re_path
from accounts import views
from django.contrib.auth import views as auth_views

urlpatterns = [

    #Auth urls 
    path('login/', views.login_user, name='login'),
    path('logout/',  auth_views.LogoutView.as_view(), name='logout'),
    path('register/', views.register, name='register'),
    path('profile/', views.profile, name='profile'),
    path('entity/', views.entity, name='entity'),
    path('partnership/', views.partnership_service, name='partnership'),

    #API
    path('api/login/', views.login_view, name='login_api'),
    path('api/register/', views.register_view, name='register_api'),
    path('api/get/staff/', views.StaffView.as_view(), name="staff_data"),
    path('api/post/staff/', views.StaffView.as_view(), name="insert_staff_data"),
    path('api/put/staff/<int:pk>/', views.StaffView.as_view(), name="update_staff_data"),
    path('api/get/staff/<int:pk>', views.AdminStaffView.as_view(), name="get_staff_data"),
    path('api/update/password/<str:email>', views.AdminStaffView.as_view(), name="update_password_data"),

    #partnership
    path('api/partnership/service/', views.PartnershipService.as_view(), name="partnership_service"),
    path('entity-booking/', views.PartnershipService.as_view(), name='entity_booking'),
    path('entity-total-charge/', views.entity_total_amount, name='entity-total-charge'),
    path('entity-detail/', views.entity_details, name='entity-detail'),
    path('update-entity-details/<int:pk>/', views.update_entity_details, name="update-entity-details"),
    path('get-entity-details/<str:email>/', views.get_entity_details, name='get-entity-details'),

    #Password
    # Just the password reset functionality
    path('password-reset/', 
         auth_views.PasswordResetView.as_view(
             template_name='password/password_reset.html',  # Your reset request form
             email_template_name='password/password_reset_email.html',  # Email template
             success_url='/accounts/password-reset/done/'  # Where to redirect after submit
         ), 
         name='password_reset'),
    
    # Confirmation that email was sent
    path('password-reset/done/', 
         auth_views.PasswordResetDoneView.as_view(
             template_name='password/password_reset_done.html'
         ), 
         name='password_reset_done'),
    
    # Allow user to set new password
    path('password-reset-confirm/<uidb64>/<token>/', 
         auth_views.PasswordResetConfirmView.as_view(
             template_name='password/password_reset_confirm.html',
             success_url='/accounts/password-reset/complete/'
         ), 
         name='password_reset_confirm'),
    
    # Confirmation that password was successfully reset
    path('password-reset/complete/', 
         auth_views.PasswordResetCompleteView.as_view(
             template_name='password/password_reset_complete.html'
         ), 
         name='password_reset_complete'),

]
