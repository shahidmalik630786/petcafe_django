from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, EmailValidator

# Create your models here.

class CustomUser(AbstractUser):

    email = models.EmailField(unique=True) 
    
    phonenumber = models.CharField(
        max_length=15, 
        unique=True, 
        validators=[RegexValidator(regex=r'^\+?1?\d{9,14}$', message='Enter a valid phone number with 9-14 digits.')]
        )

    # address = models.CharField(default='', max_length=200, validators=[RegexValidator(
    #     regex=r'^[0-9]+\s+[A-Za-z0-9\s.,\-#/]+$', 
    #     message='Enter a valid street address (number followed by street name)')]
    #     )
    address = models.CharField(default='', max_length=200)
    message = models.TextField(
        blank=True,  
        null=True,   
        max_length=1000  
        )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phonenumber']

    def __str__(self):
        return self.email


class StaffModel(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='staff_profile', null=True, blank=True)
    name = models.CharField(
    max_length=100, 
    blank = True,
    default=""
    )
    phonenumber = models.CharField(
        max_length=15, 
        unique=True, 
        blank = True,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,14}$', message='Enter a valid phone number with 9-14 digits.')]
        )
    email = models.EmailField(
        unique=True, blank = True,
        validators=[EmailValidator(message='Enter a valid email address.')]
        )
    # address = models.CharField(default='', blank = True, max_length=200 )

    address = models.CharField(default='', blank = True, max_length=200)
    
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email
    
    class Meta:
        db_table = "staff"


