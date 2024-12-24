from django.shortcuts import render, get_object_or_404
from django.contrib.auth import login
from accounts.forms import CustomUserCreationForm, CustomLoginForm, CustomStaffCreationForm
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from petService.models import Partnership
from accounts.models import CustomUser, StaffModel
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from .pagination import PageNumberPagination
from rest_framework.permissions import BasePermission
from .serializers import StaffSerializer, CafeSerializer, CafeUpdateSerializer
from rest_framework import status
from .emails import send_email_barksbean
from threading import Thread
from petService.models import cafe
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.decorators import login_required
from django.db import transaction
from petService.models import pet_payments
from rest_framework import exceptions as rest_exception
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from petService.views import admin_required


CustomUser = get_user_model()


class IsAdmin(BasePermission):
    def haspermission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser

def register(request):
    '''Partner user registeration form is send.'''
    form = CustomUserCreationForm()
    return render(request, 'partnership/register_partnership.html', {'form': form})


def login_user(request):
    form = CustomLoginForm()
    return render(request, 'accounts/login.html', {'form': form})

@login_required
def profile(request):
    form = CustomStaffCreationForm()
    return render(request, "accounts/profile.html", {'form':form})

@login_required
def entity(request):
    return render(request, 'partnership/entity.html')

@login_required
def partnership_service(request):
    return render(request, 'partnership/partnership.html')

@admin_required
def entity_details(request):
    return render(request, "partnership/entity_detail.html")

@api_view(['POST'])
def login_view(request):
    '''This function is design for login of admin, partner and staff'''
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = CustomUser.objects.get(email=email)
        print(user.email, password)
        authenticated_user = authenticate(request, email=user.email, password=password)
        if authenticated_user is not None:
            print(authenticated_user.email)
            try:
                if authenticated_user.is_superuser:
                    login(request, authenticated_user)
                    return Response({
                        'message': 'Successfully logged in',
                        'status': 'success'
                    }, status=200)
                staff = StaffModel.objects.filter(email=email).first()
                if staff:
                    if not staff.is_active:
                        return Response({
                            'error': 'Staff is not active',
                            'status': 'error'
                        }, status=403)
                
                partnership = Partnership.objects.filter(email=email).first()
                if partnership:
                    if not partnership.is_active:
                        return Response({
                            'error': 'Partnership is not active',
                            'status': 'error'
                        }, status=403)

            except Partnership.DoesNotExist:
                return Response({
                    'error': 'No partnership found for the user',
                    'status': 'error'
                }, status=404)
            
            login(request, authenticated_user)
            return Response({
                'message': 'Successfully logged in',
                'status': 'success'
            }, status=200)

        else:
            return Response({
                'error': 'Invalid email, password or not admin user',
                'status': 'error'
            }, status=401)
    
    except CustomUser.DoesNotExist:
        return Response({
            'error': 'Invalid email or password',
            'status': 'error'
        }, status=401)


@api_view(['POST'])
def register_view(request):
    '''This function is design to register partners.'''
    try:
        user_data = {
            'name': request.data.get('name', '').strip().lower(),
            'email': request.data.get('email', '').strip().lower(),
            'phonenumber': request.data.get('phonenumber', '').strip(),
            'message': request.data.get('message', '').strip(),
            'password1': request.data.get('password1', ''),
            'password2': request.data.get('password2', ''),
        }

        partnership_data = {
            'name': request.data.get('name', '').strip(),
            'phone': request.data.get('phonenumber', '').strip(),
            'email': request.data.get('email', '').strip().lower(),
            'message': request.data.get('message', '').strip(),
        }

        form = CustomUserCreationForm(user_data)
        
        if form.is_valid():
            user = form.save()
            Partnership.objects.create(**partnership_data)

            return Response({
                'message': 'Registration successful',
                'status': 'success',
                'user_id': user.id
            }, status=201)
        else:
            return Response({
                'error': form.errors,
                'status': 'error'
            }, status=400)

    except Exception as e:
        return Response({
            'error': {'general': ['Registration failed']},
            'status': 'error',
            'details': str(e)
        }, status=500)


class AdminStaffView(LoginRequiredMixin, APIView):
    '''Admin Panel partnership edit and get data for form prefilling'''
    permission_classes = [IsAdmin]
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = StaffModel.objects.get(id=pk)
            if not queryset:
                return Response({'error': 'project not found'}, status=404)
            serializer = StaffSerializer(queryset)
            return Response(serializer.data)
        except Partnership.DoesNotExist:
            return Response({'error': 'Partnership not found'}, status=404)
        

    def put(self, request, email=None):
        """
        Update staff member's password
        """
        try:
            # Retrieve the user
            user = get_object_or_404(get_user_model(), email=email)
            
            # Extract and strip passwords
            password1 = request.data.get('password1', '').strip()
            password2 = request.data.get('password2', '').strip()
            
            # Comprehensive password validation
            if not all([password1, password2]):
                return Response({
                    "error": {"password": ["Both password fields are required"]},
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if password1 != password2:
                return Response({
                    "error": {"password": ["Passwords do not match"]},
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enhanced password complexity checks
            if len(password1) < 8:
                return Response({
                    "error": {"password": ["Password must be at least 8 characters long"]},
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Regex for more complex password validation
            import re
            if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$', password1):
                return Response({
                    "error": {"password": ["Password must include letters, numbers, and special characters"]},
                    "status": "error"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Update password
            user.set_password(password1)
            user.save()
            
            # Log password change event (optional)
            # logger.info(f"Password changed for user {email}")
            
            return Response({
                "message": "Password updated successfully",
                "status": "success"
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log the exception
            # logger.error(f"Password update error: {str(e)}")
            return Response({
                "error": {"general": [str(e)]},
                "status": "error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class StaffView(LoginRequiredMixin, APIView):
    permission_classes = [IsAdmin]


    def get(self, request):
        # Fetching the queryset
        queryset = StaffModel.objects.all().order_by('id')

        # Filtering based on search value from query parameters
        search_value = request.query_params.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(name__icontains=search_value)

        status = request.query_params.get('status', '')
        if status == '1':  # Active
            queryset = queryset.filter(is_active=True)
        elif status == '2':  # Deactive
            queryset = queryset.filter(is_active=False)

        paginator = PageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = StaffSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)
        

    # def put(self, request, pk=None):
    #     """
    #     Update an existing staff member
    #     """
    #     try:
    #         # Retrieve the staff member
    #         staff_member = get_object_or_404(StaffModel, pk=pk)
            
    #         # Prepare update data
    #         staff_update_data = {
    #             'name': request.data.get('name', '').strip(),
    #             'phonenumber': request.data.get('phone', '').strip(),
    #             'email': request.data.get('email', '').strip().lower(),
    #             'address': request.data.get('address', '').strip(),
    #             'is_active': request.data.get('is_active', staff_member.is_active)
    #         }

    #         # Validate and update
    #         serializer = StaffSerializer(staff_member, data=staff_update_data, partial=True)
            
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response({
    #                 "message": "Staff member updated successfully",
    #                 "status": "success"
    #             }, status=status.HTTP_200_OK)
            
    #         return Response({
    #             "error": serializer.errors,
    #             "status": "error"
    #         }, status=status.HTTP_400_BAD_REQUEST)
        
    #     except Exception as e:
    #         # Log the exception
    #         return Response({
    #             "error": {"general": ["Update failed"]},
    #             "status": "error"
    #         }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk=None):
        """
        Update an existing staff member
        """
        try:
            # Retrieve the staff member
            staff_member = get_object_or_404(StaffModel, pk=pk)
            name = request.data.get('name', '').strip()
            phonenumber = request.data.get('phone', '').strip()
            email = request.data.get('email', '').strip().lower()
            address = request.data.get('address', '').strip()

            staff_update_data = {
                'name': name,
                'phonenumber': phonenumber,
                'email': email,
                'address': address,
                'is_active': request.data.get('is_active', staff_member.is_active)
            }
            user = CustomUser.objects.filter(email=staff_member.email).first()
            if user:
                user.username = name
                user.email = email
                user.phonenumber = phonenumber
                user.address = address
            serializer = StaffSerializer(staff_member, data=staff_update_data, partial=True)
            if serializer.is_valid():
                try:
                    with transaction.atomic():
                        user.save()
                        serializer.save()
                        return Response({
                            "message": "Staff member and User updated successfully",
                            "status": "success"
                        }, status=status.HTTP_200_OK)
                except Exception as e:
                            return Response({"error": str(e), "msg":"Error while updating the data"}, status= status.HTTP_400_BAD_REQUEST)
            return Response({
                "error": serializer.errors,
                "status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
    
    
    def post(self, request):
        try:
            # password2 = request.data.get('password2', ''),
            email = str(request.data.get('email', '').strip().lower())
            password = str(request.data.get('password2', ''),)

            user_data = {
                'name': request.data.get('name', '').strip().lower(),
                'phonenumber': request.data.get('phonenumber', '').strip(),
                'email': request.data.get('email', '').strip().lower(),
                'address': request.data.get('address', '').strip(),
                'password1': request.data.get('password1', ''),
                'password2': request.data.get('password2', ''),
            }

            form = CustomStaffCreationForm(user_data)
            if form.is_valid():
                user = form.save()
                staff_data = {
                'user':user,
                'name': request.data.get('name', '').strip(),
                'phonenumber': request.data.get('phonenumber', '').strip(),
                'email': request.data.get('email', '').strip().lower(),
                'address': request.data.get('address', '').strip(),
                }
                StaffModel.objects.create(**staff_data)
                email_thread = Thread(target = send_email_barksbean, args= (email, password))
                email_thread.start()

                return Response({
                    'message': 'Registration successful',
                    'status': 'success',
                    'user_id': user.id
                }, status=201)
            else:
                return Response({
                    'error': form.errors,
                    'status': 'error'
                }, status=400)
        
        except Exception as e:
            return Response({
                'error': {'general': ['Registration failed']},
                'status': 'error',
                'details': str(e)
            }, status=500)
    

class PartnershipService(LoginRequiredMixin, APIView):
    '''Admin panel pagination of partnership data'''
    permission_classes = [IsAdmin]
    def get(self, request):
        try:
            email = request.user.email
            queryset = cafe.objects.filter(Email=email).order_by('id')

            search_value = request.query_params.get('search[value]', '')
            if search_value:
                queryset = queryset.filter(Pet_Name__icontains=search_value)

            status = request.query_params.get('status', '')
            if status == '1':  # Active
                queryset = queryset.filter(payment_status=True)
            elif status == '2':  # Deactive
                queryset = queryset.filter(payment_status=False)

            paginator = PageNumberPagination()
            paginated_queryset = paginator.paginate_queryset(queryset, request)
            serializer = CafeSerializer(paginated_queryset, many=True)
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def post(self, request):
        print(request.data.get('phNum'))
        try:
            # Validate required fields
            required_fields = [
                'bookingOpt', 'parName', 'petName', 'email', 
                'phNum', 'address', 'petBreed', 'petDOB', 
                'petSize', 'petBehave', 'Pet_checkIn', 'Pet_checkOut',
            ]
            
            # Check for missing fields
            missing_fields = [
                field for field in required_fields 
                if not request.data.get(field, '').strip()
            ]
            
            if missing_fields:
                return Response({
                    'status': 'error',
                    'error': {
                        'general': [f'Missing required fields: {", ".join(missing_fields)}']
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Additional validations
            # Email validation
            try:
                validate_email(request.data.get('email'))
            except ValidationError:
                return Response({
                    'status': 'error',
                    'error': {
                        'general': ['Invalid email address']
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Phone number validation
            phone = request.data.get('phNum')
            if not phone.isdigit() or len(phone) != 10:
                return Response({
                    'status': 'error',
                    'error': {
                        'general': ['Invalid phone number. Must be 10 digits.']
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Extract and prepare data
            data = {
                'Booking_Option': request.data.get('bookingOpt', ''),
                'Parent_Name': request.data.get('parName', '').strip(),
                'Pet_Name': request.data.get('petName', '').strip(),
                'Email': request.data.get('email', '').strip().lower(),
                'Phone_Number': phone,
                'Address': request.data.get('address', '').strip(),
                'Pet_Breed': request.data.get('petBreed', '').strip(),
                'Pet_DOB': request.data.get('petDOB', ''),
                'Pet_Size': request.data.get('petSize', ''),
                'Pet_Behaviour': request.data.get('petBehave', ''),
                'aggrement': 'Yes' if request.data.get('aggreement') else 'No',
                'Pet_checkIn': request.data.get('Pet_checkIn'),
                'Pet_checkOut': request.data.get('Pet_checkOut'),
                'Special_instruction': request.data.get('aggreement'),
            }

            # Create and save the cafe booking
            booking = cafe.objects.create(**data)

            payment_data = {
                'id': booking.id,
                'pet_id': booking.id,  
                'Pet_Name': booking.Pet_Name, 
                'Parent_Name': booking.Parent_Name,
                'Pet_Breed': booking.Pet_Breed,
                'per_day_charge':request.data.get('per_day_charge', ''),
                'PnD_service_charge':request.data.get('pick_up_charge', ''),
                'grooming_charge':request.data.get('grooming_charge', ''),
                'Total_Payment':request.data.get('total_amount', ''),
            }

            payment = pet_payments.objects.create(**payment_data)
            
            return Response({
                'message': 'Booking successful',
                'status': 'success',
                'booking_id': booking.id
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            # Log the error for debugging
            print(f"Booking Error: {str(e)}")
            
            return Response({
                'error': {'general': ['Booking failed. Please try again.']},
                'status': 'error',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def entity_total_amount(request):
    try:
        check_in_date = request.GET.get('Pet_checkIn')
        checkout_date = request.GET.get('Pet_checkOut')
        per_day_charge = request.GET.get('per_day_charge')
        pickup_drop_charge = request.GET.get('pick_up_charge', '0')  # Default to '0' string
        grooming_charge = request.GET.get('grooming_charge', '0')    # Default to '0' string

        # Validate required fields
        if not check_in_date or not checkout_date or not per_day_charge:
            return Response({'error': 'Missing required fields'}, status=400)

        # Convert to float after getting the values
        per_day_charge = float(per_day_charge)
        pickup_drop_charge = float(pickup_drop_charge)
        grooming_charge = float(grooming_charge)

        # Parse dates

        check_in_date = datetime.strptime(check_in_date, "%Y-%m-%d")
        checkout_date = datetime.strptime(checkout_date, "%Y-%m-%d")
        num_days = (checkout_date - check_in_date).days


        if num_days < 0:
            return Response({'error': 'Check-out date must be after check-in date'}, status=400)

        # Calculate total amount
        total_amount = (num_days * per_day_charge) + pickup_drop_charge + grooming_charge
        return Response({'total_amount': total_amount})

    except ValueError as e:
        return Response({'error': f'Invalid input values: {str(e)}'}, status=400)
    except Exception as e:
        return Response({'error': f'An error occurred: {str(e)}'}, status=400)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated, IsAdmin])
def update_entity_details(request, pk=None):
    try:
        cafe_instance = get_object_or_404(cafe, pk=pk)
        data = {
            'Parent_Name': request.data.get('Parent_Name', '').strip(),
            'Pet_Name': request.data.get('Pet_Name', '').strip(),
            'Phone_Number': request.data.get('Phone_Number', '').strip(),
            'Pet_Breed': request.data.get('Pet_Breed', '').strip(),
            'Pet_checkIn': request.data.get('Pet_checkIn', '').strip(),
            'Pet_checkOut': request.data.get('Pet_checkOut', '').strip(),
            'payment_status': request.data.get('payment_status', False),
        }
        
        serializer = CafeUpdateSerializer(cafe_instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Details updated successfully",
                "status": "success"
            }, status=status.HTTP_200_OK)
        return Response({
            "error": serializer.errors,
            "status": "error"
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            "error": str(e),
            "status": "error"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_entity_details(request, email=None):
    try:
        queryset = cafe.objects.filter(Email = email).first()
        if not queryset:
            return Response(
                {"msg": "Entity not found", "status": "error"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = CafeUpdateSerializer(queryset)
        return Response(serializer.data)
    except Exception as e:
        return Response({"msg":str(e), "status": "error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)