from django.db import models
from django.core.validators import RegexValidator, EmailValidator

# Create your models here.

class cafe(models.Model):
    Booking_Option = models.CharField(max_length=10)
    Parent_Name = models.CharField(max_length=30)
    Pet_Name = models.CharField(max_length=50)
    Email = models.EmailField(max_length=50)
    Phone_Number = models.CharField(max_length=13)
    Alternate_Phone = models.CharField(max_length=13)
    Address = models.CharField(max_length=500)
    Pet_Breed = models.CharField(max_length=70)
    Pet_DOB = models.CharField(max_length=12)
    Pet_checkIn = models.CharField(max_length=12)
    Pet_checkOut = models.CharField(max_length=12)
    Pet_FeedingInfo = models.CharField(max_length=200)
    Pet_Size = models.CharField(max_length=20)
    Pet_Behaviour = models.CharField(max_length=15)
    Pet_Grooming = models.CharField(max_length=25)
    Special_instruction = models.CharField(max_length=500)
    aggrement = models.CharField(max_length=10)
    added_date = models.DateTimeField(auto_now_add=True)
    boarding_status = models.CharField(max_length=10)
    state_of_board = models.CharField(max_length=20)
    source = models.CharField(max_length=20)
    payment_status = models.BooleanField(default=False)
    
    class Meta:
        db_table = "cafe"

    def __str__(self):
        return self.Pet_Name

class pet_payments(models.Model):
    pet_id = models.BigIntegerField()
    Pet_Name = models.CharField(max_length=30)
    Parent_Name = models.CharField(max_length=30)
    Pet_Breed = models.CharField(max_length=20)
    Advance_Payment = models.BigIntegerField(default=0)
    Balance_Payment = models.BigIntegerField(default=0)
    Total_Payment = models.BigIntegerField(default=0)
    per_day_charge = models.BigIntegerField(default=0)
    PnD_service_charge = models.BigIntegerField(default=0)
    grooming_charge = models.BigIntegerField(default=0)
    added_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "pet_payments"

class comments(models.Model):
    date_added = models.DateTimeField(auto_now_add=True)
    Customer_Name = models.CharField(max_length=40)
    phone_Number = models.CharField(max_length=13)
    Email = models.CharField(max_length=30)
    message = models.CharField(max_length=500)

    class Meta:
        db_table = "comments"

class callus(models.Model):
    date_added = models.DateTimeField(auto_now_add=True)
    Customer_Name = models.CharField(max_length=40)
    phone_Number = models.CharField(max_length=13)
    enquiry = models.CharField(max_length=500)

    class Meta:
        db_table = "callus"


class cust_vet_schedule(models.Model):
    date_added = models.DateTimeField(auto_now_add=True)
    Parent_Name = models.CharField(max_length=40)
    Phone_Number = models.CharField(max_length=13)
    Scheduled_date = models.CharField(max_length=12)
    Scheduled_time = models.CharField(max_length=10)
    service_choosen = models.CharField(max_length=20)

    class Meta:
        db_table = "cust_vet_schedule"

class vet_check(models.Model):
    date_added = models.DateTimeField(auto_now_add=True)
    Parent_Name = models.CharField(max_length=40)
    Phone_Number = models.CharField(max_length=13)
    Scheduled_date = models.CharField(max_length=12)
    Scheduled_time = models.CharField(max_length=10)
    service_choosen = models.CharField(max_length=20)
    class Meta:
        db_table = "vet_check"

class pet_types(models.Model):
    date_added = models.DateTimeField(auto_now_add=True)
    Pet_Type = models.CharField(max_length=40)
    class Meta:
        db_table = "pet_types"

#Partnership
class Partnership(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15 ,validators=[RegexValidator(regex=r'^\+?1?\d{9,14}$', message='Enter a valid phone number with 9-14 digits.')])
    email = models.EmailField(validators=[EmailValidator(message='Enter a valid email address.')])
    message = models.TextField(validators=[RegexValidator(regex=r'^.{10,1000}$', message='Message must be between 10 and 1000 characters.')])
    is_active = models.BooleanField(default=False)

    class Meta:
        db_table = "partnership"
    
    def __str__(self):
        return self.name
    



