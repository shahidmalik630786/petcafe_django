from .models import Partnership, cafe
from rest_framework import serializers


class PartnershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partnership
        fields = '__all__'

class CafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = cafe
        fields = ["id", "Pet_Name", "Parent_Name", "Phone_Number", "Pet_Breed", "Pet_checkIn", "Pet_checkOut", "boarding_status"]