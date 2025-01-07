from http.client import responses
from pyexpat.errors import messages
from django.shortcuts import render, HttpResponse, get_object_or_404
from django.contrib.auth import get_user_model
from django.shortcuts import redirect, render
from django.utils.datastructures import MultiValueDictKeyError
from django.http import HttpResponse
from .models import cafe, comments, callus, cust_vet_schedule, pet_payments
from rest_framework import decorators as rest_decorators , status
from .serializers import PartnershipSerializer, CafeSerializer
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import Partnership
from .pagination import PartnershipPageNumberPagination, CafePageNumberPagination
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import user_passes_test
from rest_framework.permissions import BasePermission
from accounts.forms import CustomStaffCreationForm
from accounts.decorators import staff_active_required
import logging
from django.db import transaction
# Create your views here.

CustomUser = get_user_model()


logging = logging.getLogger(__name__)


class IsAdmin(BasePermission):
    def haspermission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


def admin_required(view_func):
    return user_passes_test(lambda user: user.is_superuser, login_url='/login/')(view_func)

def home(request):
    return render(request, 'index.html')

def pet_breed(request):
    return render(request, 'pet_breed.html')

def about(request):
    return render(request, 'about.html')

def offer(request):
    return render(request, 'offer.html')

def bangalore_boarding(request):
    return render(request, 'bangalore_boarding.html')

def book(request):
    return render(request, 'booking.html')

def terms(request):
    return render(request, 'terms.html')

def policies(request):
    return render(request, 'policies.html')

def contact(request):
    return render(request, 'contact.html')

@login_required
def partnership(request):
    return render(request, 'partnership.html')

def partnership_status(request):
    return render(request, 'partnership/partnership_status.html')

#Admin panel view
# @admin_required
@admin_required
def partnership_admin(request):
    return render(request, "accounts/admin.html")

@staff_active_required
def cafe_admin(request):
    return render(request, "staff/cafe_admin.html")

@staff_active_required
def fetch_details(request):    
    #phNum = request.GET.get('phn')
    #petData = cafe.objects.filter(Phone_Number='9482536766', id=7).values()
    #petData = cafe.objects.get(Phone_Number=phNum)    
    #incampus = cafe.objects.filter(boarding_status='BOOKED', boarding_status='boarded',boarding_status='incampus')
    #incampus = cafe.objects.all()
    incampus = cafe.objects.filter(boarding_status__in=['boarded','BOOKED','inCampus'])
    for data in incampus:
        row_data = pet_payments.objects.get(pet_id=data.id)
        data.pending_amount = row_data.Balance_Payment
        data.total_amount = row_data.Total_Payment
        data.advance_amount = row_data.Advance_Payment
        data.per_day_charge = row_data.per_day_charge
        data.pnd_charge = row_data.PnD_service_charge
        data.grooming_charge = row_data.grooming_charge
    return render(request, 'staff/fetch.html', {'userdata': incampus,  })

@admin_required
def staff(request):
    form = CustomStaffCreationForm()
    return render(request, "staff/staff.html", {'form':form})

def bookmyslot(request):
    #  if request.method == "POST":
    #     return HttpResponse(request.POST['petSize'])
    petSize = request.POST.get('petSize','NotAvailable')
    petBehave = request.POST.get('petBehave','NotAvailable')
    feedInfo = request.POST.get('feedInfo','NR')

    try:
        bookOption = request.POST['bookingOpt']
        parentName = request.POST['parName']
        petName = request.POST['petName']
        emailid = request.POST['email']    
        phoneNumber = request.POST['phNum']
        alterNumber = request.POST['altNum']
        address = request.POST['poAddress']
        petBreed = request.POST['petBreed']
        petDOB = request.POST['petDOB']
        checkIn = request.POST['chkIn']
        checkOut = request.POST.get('chkOut','NR')
        
        specialInstruction = request.POST['specialInstruct']
        aggrement = request.POST['aggreement']
    except MultiValueDictKeyError as e:
        #return HttpResponse(f"Missing field: {str(e)}", status=400)
        pass
    if ( bookOption != "grooming"):
        mycafe = cafe(Booking_Option=bookOption, Parent_Name=parentName, Pet_Name=petName, Email=emailid, 
                    Phone_Number=phoneNumber,Alternate_Phone=alterNumber, Address=address,Pet_Breed=petBreed,
                    Pet_DOB=petDOB, Pet_checkIn= checkIn, Pet_checkOut=checkOut , Pet_FeedingInfo=feedInfo , Pet_Size=petSize, Pet_Behaviour=petBehave ,
                        Special_instruction=specialInstruction , aggrement= aggrement, boarding_status='BOOKED'
                    )
        mycafe.save()
    elif( bookOption == "grooming"):
        groomingchoice = request.POST.get('groomingCharge','NA')
        mycafe = cafe(
            Booking_Option=bookOption,
            Parent_Name = parentName,
            Pet_Name = petName,
            Email = emailid,
            Phone_Number = phoneNumber,
            Alternate_Phone = alterNumber,
            Address = address,
            Pet_Breed = petBreed,
            Pet_DOB = petDOB,
            Pet_checkIn = checkIn,
            Pet_Grooming = groomingchoice,
            Special_instruction=specialInstruction,
            Pet_Size = petSize,
            Pet_Behaviour=petBehave,
            aggrement= aggrement,
            boarding_status='BOOKED'
        )
        mycafe.save()

    # elif( bookOption == "training"):
    #     mycafe = cafe(Booking_Option=bookOption, Parent_Name=parentName, Pet_Name=petName, Email=emailid, 
    #                 Phone_Number=phoneNumber,Alternate_Phone=alterNumber, Address=address,Pet_Breed=petBreed,
    #                 Pet_DOB=petDOB, Pet_checkIn= checkIn, Pet_checkOut=checkOut, Pet_Size=petSize, Pet_Behaviour=petBehave,
    #                     Special_instruction=specialInstruction , aggrement= aggrement, boarding_status='BOOKED' )
    #     mycafe.save()
    newId = mycafe.id 
    mypayment = pet_payments(pet_id=newId, Pet_Name=petName, Parent_Name=parentName,Pet_Breed=petBreed)
    mypayment.save()
    return redirect("/")

def pet_service_bangalore(request):
    custName = request.POST['cust_Name']
    phone = request.POST['phNumber']
    enquiry = request.POST.getlist('wpforms[fields][9][]')
    full_enquiry = '|'.join(enquiry)
    call = callus(Customer_Name=custName, phone_Number=phone, enquiry=full_enquiry)
    call.save()
    return redirect("/bangalore_boarding")


def get_message(request):    
    if request.method == 'GET':
        name = request.GET['Name']
        phNum = request.GET['phNum']
        email = request.GET['email']
        message = request.GET['message']
        mycomments = comments(Customer_Name=name, phone_Number=phNum, Email=email, message=message )
        mycomments.save()        
        return HttpResponse("success")
    else:
        return HttpResponse("Request method is not GET")
    
def galleries(request):
    return render(request, "gallery.html")

def vet_assist(request):
    if request.method == 'GET':
        name = request.GET['Name']
        phone = request.GET['phNum']
        cDate = request.GET['Date']
        cTime = request.GET['Time']
        petCheck = request.GET['petCheck']
        schedule_vet = cust_vet_schedule(Parent_Name=name, Phone_Number=phone, Scheduled_date=cDate, Scheduled_time=cTime, service_choosen=petCheck)
        schedule_vet.save()
        return HttpResponse("success")
    else:
        return HttpResponse("Request method is not GET")

def pet_training(request):
    return render(request, 'pet_train.html')

def fetch_test_details(request):
    if request.user.is_authenticated:
        incampus = cafe.objects.filter(boarding_status__in=['boarded','BOOKED','inCampus'])
        for data in incampus:
            row_data = pet_payments.objects.get(pet_id=data.id)
            data.pending_amount = row_data.Balance_Payment
            data.total_amount = row_data.Total_Payment
            data.advance_amount = row_data.Advance_Payment
            data.per_day_charge = row_data.per_day_charge
            data.pnd_charge = row_data.PnD_service_charge
            data.grooming_charge = row_data.grooming_charge
        return render(request, 'fetch.html', {'userdata': incampus,  })
    else:
        return render(request, 'login.html',)



def edit_details(request, id):
    petDetails = cafe.objects.get(id=id)
    
    row_data = pet_payments.objects.get(pet_id=petDetails.id)
    petDetails.total_amount = row_data.Total_Payment
    petDetails.advance_amount = row_data.Advance_Payment
    petDetails.pending_amount = row_data.Balance_Payment
    petDetails.per_day_charge = row_data.per_day_charge
    petDetails.pnd_charge = row_data.PnD_service_charge
    petDetails.grooming_charge = row_data.grooming_charge
    return render(request, 'edit_pet_details.html', {'petDetails': petDetails})   

def generateBill(request, id):
    petDetails = cafe.objects.get(id=id)
    petPaymentDetails = pet_payments.objects.get(pet_id=petDetails.id)
    petDetails.total_amount = petPaymentDetails.Total_Payment
    petDetails.advance_amount = petPaymentDetails.Advance_Payment
    petDetails.pending_amount = petPaymentDetails.Balance_Payment
    return render(request, 'generateBill.html', {'petDetails': petDetails} )

def update_details(request, id):
    newAddress = request.POST.get('poAddress') #'poAddress']
    newcheckOut = request.POST['chkOut']
    newBoardingStatus = request.POST['boardingStat']
    newStateOfBoarding = request.POST['BoardingState']
    newSource = request.POST['source']
    per_day_charge = request.POST['per_day_charge']
    pndCharges = request.POST['pick_up_charge']
    groomingCharges = request.POST["grooming_charge"]
    newTotalAmount = request.POST["total_amount"]
    newAdvanceAmount = request.POST["advance_amount"]
    pendingAmount = (int(newTotalAmount)) - (int(newAdvanceAmount))
    #pendingAmount = request.POST["pending_amount"]
    
    #return HttpResponse(f"{pndCharges} | {newTotalAmount} | {pendingAmount} | {request.POST} |" )
    #newTotalAmount = request.POST.get('total_amount')
    #newAdvanceAmount = request.POST.get('advance_amount')
    #pendingAmount = request.POST.get("pending_amount")
    #pnding = request.POST["pending_amount"]
    #return HttpResponse(f"{pndCharges} | {groomingCharges} |{request} | {pnding} |")
    
    #pendingAmount = (int(newTotalAmount)) - (int(newAdvanceAmount))
    cafeObj = cafe.objects.get(id=id)
    cafeObj.Address = newAddress
    cafeObj.boarding_status = newBoardingStatus
    cafeObj.Pet_checkOut = newcheckOut
    cafeObj.state_of_board = newStateOfBoarding
    cafeObj.source = newSource
    cafeObj.save()

    #payment_obj = pet_payments(Pet_Name=petName, Parent_Name=Parname, Pet_Breed=petBreed, Advance_Payment=newAdvanceAmount, )
    payment_obj = pet_payments.objects.get(pet_id=id)
    payment_obj.Advance_Payment = newAdvanceAmount
    payment_obj.Total_Payment = newTotalAmount
    payment_obj.Balance_Payment = pendingAmount
    payment_obj.PnD_service_charge = pndCharges
    payment_obj.grooming_charge = groomingCharges
    payment_obj.per_day_charge = per_day_charge
    payment_obj.save()

    return redirect("/fetch")

def pet_boarding(request):
    return render(request, 'pet_board.html')
 

#API
@csrf_exempt
@rest_decorators.api_view(['POST'])
def partnershipView(request):
    '''Partnership Registeration form'''
    try:
        serializer = PartnershipSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Partnership form submitted successfully', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)


class AdminPartnershipView(LoginRequiredMixin, APIView):
    '''Admin Panel partnership edit and get data for form prefilling'''
    permission_classes = [IsAdmin]
    def get(self, request, pk=None, *args, **kwargs):
        try:
            queryset = Partnership.objects.get(id=pk)
            if not queryset:
                return Response({'error': 'project not found'}, status=404)
            serializer = PartnershipSerializer(queryset)
            return Response(serializer.data)
        except Partnership.DoesNotExist:
            return Response({'error': 'Partnership not found'}, status=404)
        
    def put(self, request, pk=None):
        try:
            project = get_object_or_404(Partnership, pk=pk)
            user = CustomUser.objects.filter(email=project.email).first()
            logging.info(f"Updating CustomUser: username={user.username}, email={user.email}")
            if user:
                user.username = request.data.get('name', '').strip()
                user.email = request.data.get('email', '').strip()
                user.phonenumber = request.data.get('phone', '').strip()
                
                logging.info(f"username from customuser table {user.username}" )
                serializer = PartnershipSerializer(project, data=request.data)
                if serializer.is_valid():
                    try:
                        with transaction.atomic():
                            serializer.save()
                            user.save()
                        return Response({'msg':"Data updated successfully"}, status=status.HTTP_200_OK)
                    except Exception as e:
                        logging.error(f"Transaction failed: {e}")
                        return Response({"error": str(e), "msg": "Error while storing data"}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"error": serializer.errors}, status= status.HTTP_400_BAD_REQUEST)
            else:
                logging.warning("No matching CustomUser found for email.")
                return Response({"msg": "No user associated with this email"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        

class PartnershipView(LoginRequiredMixin, APIView):
    '''Admin panel pagination of partnership data'''
    permission_classes = [IsAdmin]
    def get(self, request):
        # Fetching the queryset
        queryset = Partnership.objects.all().order_by('id')

        # Filtering based on search value from query parameters
        search_value = request.query_params.get('search[value]', '')
        if search_value:
            queryset = queryset.filter(email__icontains=search_value)

        
        status = request.query_params.get('status', '')
        if status == '1':  # Active
            queryset = queryset.filter(is_active=True)
        elif status == '2':  # Deactive
            queryset = queryset.filter(is_active=False)

        paginator = PartnershipPageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        serializer = PartnershipSerializer(paginated_queryset, many=True)
        return paginator.get_paginated_response(serializer.data)



    