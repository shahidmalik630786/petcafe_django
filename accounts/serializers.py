from .models import CustomUser, StaffModel
from rest_framework import serializers
from petService.models import cafe, pet_payments

class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffModel
        fields = '__all__'

class StaffInsertSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class CafeSerializer(serializers.ModelSerializer):
    pending_amount = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    advance_amount = serializers.SerializerMethodField()
    per_day_charge = serializers.SerializerMethodField()
    pnd_charge = serializers.SerializerMethodField()
    grooming_charge = serializers.SerializerMethodField()

    class Meta:
        model = cafe
        fields = '__all__'

    def get_pending_amount(self, obj):
        return self.get_payment_data(obj, 'Balance_Payment')

    def get_total_amount(self, obj):
        return self.get_payment_data(obj, 'Total_Payment')

    def get_advance_amount(self, obj):
        return self.get_payment_data(obj, 'Advance_Payment')

    def get_per_day_charge(self, obj):
        return self.get_payment_data(obj, 'per_day_charge')

    def get_pnd_charge(self, obj):
        return self.get_payment_data(obj, 'PnD_service_charge')

    def get_grooming_charge(self, obj):
        return self.get_payment_data(obj, 'grooming_charge')

    def get_payment_data(self, obj, field_name):
        try:
            row_data = pet_payments.objects.get(pet_id=obj.id)
            return getattr(row_data, field_name, 0)
        except pet_payments.DoesNotExist:
            return 0
        
class CafeUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = cafe
        fields = '__all__'