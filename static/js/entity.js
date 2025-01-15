// Update Form

// Function to calculate total amount
function calculateTotalAmount() {
    // Get values from form
    const checkIn = document.getElementById('Pet_checkIn').value;
    const checkOut = document.getElementById('Pet_checkOut').value;
    const perDayCharge = document.getElementById('per_day_charge').value;
    const pickUpCharge = document.getElementById('pick_up_charge').value || 0;
    const groomingCharge = document.getElementById('grooming_charge').value || 0;

    // Validate required fields
    if (!checkIn || !checkOut || !perDayCharge) {
        return;
    }

    // Get the auth token - you'll need to set this based on your auth system
    const authToken = localStorage.getItem('authToken'); // Adjust this based on where you store the token
    console.log(authToken)

    // Prepare the request
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        }
    };

    // Build query parameters
    const params = new URLSearchParams({
        Pet_checkIn: checkIn,
        Pet_checkOut: checkOut,
        per_day_charge: perDayCharge,
        pick_up_charge: pickUpCharge,
        grooming_charge: groomingCharge
    });

    // Make the API call
    fetch(`/accounts/entity-total-charge/?${params.toString()}`, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update the total amount field
            document.getElementById('total_amount').value = data.total_amount;
        })
        .catch(error => {
            console.error('Error calculating total amount:', error);
            const statusElement = document.getElementById('status');
            statusElement.innerHTML = `
                <div class="alert alert-success text-center">
                    Booking successful! Your booking ID is: ${data.booking_id}
                </div>
            `;
        });
}

// Add event listeners to relevant form fields
document.getElementById('Pet_checkIn').addEventListener('change', calculateTotalAmount);
document.getElementById('Pet_checkOut').addEventListener('change', calculateTotalAmount);
document.getElementById('per_day_charge').addEventListener('input', calculateTotalAmount);
document.getElementById('pick_up_charge').addEventListener('input', calculateTotalAmount);
document.getElementById('grooming_charge').addEventListener('input', calculateTotalAmount);




// Insert Form
document.getElementById('entityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    document.getElementById('status').textContent = "";
    const form_data = document.getElementById("entityForm")

    // Reset all error messages
    const errorFields = [
        'bookingError', 'parNameError', 'petNameError', 'emailError', 
        'phNumError', 'addressError', 'petBreedError', 'petDOBError', 
        'petSizeError', 'petBehaveError', 'specialInstructError', 'Pet_checkInError', 
        'Pet_checkOutError', 'perdayChargeError', 'pickupChargeError', 'groomingChargeError',
        'totalAmountError'
    ];
    errorFields.forEach(fieldId => {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) errorElement.textContent = '';
    });

    // Validation object to track errors
    const errors = {};

    // Validate Booking Option
    const bookingOpt = document.getElementById('bookingOpt');
    if (!bookingOpt.value) {
        errors.bookingOpt = 'Please select a booking option';
        document.getElementById('bookingError').textContent = errors.bookingOpt;
    }

    // Validate Parent Name
    const parName = document.getElementById('parName');
    if (!parName.value.trim()) {
        errors.parName = 'Parent name is required';
        document.getElementById('parNameError').textContent = errors.parName;
    }

    // Validate Pet Name
    const petName = document.getElementById('petName');
    if (!petName.value.trim()) {
        errors.petName = 'Pet name is required';
        document.getElementById('petNameError').textContent = errors.petName;
    }

    // Validate Email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        errors.email = 'Email is required';
        document.getElementById('emailError').textContent = errors.email;
    } else if (!emailRegex.test(email.value)) {
        errors.email = 'Please enter a valid email address';
        document.getElementById('emailError').textContent = errors.email;
    }

    // Validate Phone Number
    const phNum = document.getElementById('phNum');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phNum.value.trim()) {
        errors.phNum = 'Phone number is required';
        document.getElementById('phNumError').textContent = errors.phNum;
    } else if (!phoneRegex.test(phNum.value)) {
        errors.phNum = 'Please enter a valid 10-digit phone number';
        document.getElementById('phNumError').textContent = errors.phNum;
    }

    // Validate Address
    const address = document.getElementById('address');
    if (!address.value.trim()) {
        errors.address = 'Address is required';
        document.getElementById('addressError').textContent = errors.address;
    }

    // Validate Pet Breed
    const petBreed = document.getElementById('petBreed');
    if (!petBreed.value.trim()) {
        errors.petBreed = 'Pet breed is required';
        document.getElementById('petBreedError').textContent = errors.petBreed;
    }

    // Validate Pet DOB
    const petDOB = document.getElementById('petDOB');
    if (!petDOB.value) {
        errors.petDOB = 'Pet date of birth is required';
        document.getElementById('petDOBError').textContent = errors.petDOB;
    }

    // Validate Pet Size
    const petSize = document.getElementById('petSize');
    if (!petSize.value) {
        errors.petSize = 'Please select pet size';
        document.getElementById('petSizeError').textContent = errors.petSize;
    }

    // Validate Pet Behaviour
    const petBehave = document.getElementById('petBehave');
    if (!petBehave.value) {
        errors.petBehave = 'Please select pet behaviour';
        document.getElementById('petBehaveError').textContent = errors.petBehave;
    }

    // Validate Agreement
    const agreement = document.getElementById('aggreement');
    if (!agreement.checked) {
        errors.agreement = 'Please agree to the terms and conditions';
        document.getElementById('specialInstructError').textContent = errors.agreement;
    }

    // Validate Check-in
    const Pet_checkIn = document.getElementById('Pet_checkIn');
    if (!Pet_checkIn.value) {
        errors.Pet_checkIn = 'Check-in date is required';
        document.getElementById('Pet_checkInError').textContent = errors.Pet_checkIn;
    }

    // Validate Check-out
    const Pet_checkOut = document.getElementById('Pet_checkOut');
    if (!Pet_checkOut.value) {
        errors.Pet_checkOut = 'Check-out date is required';
        document.getElementById('Pet_checkOutError').textContent = errors.Pet_checkOut;
    }

    if (Pet_checkIn.value && new Date(Pet_checkOut.value) <= new Date(Pet_checkIn.value)) {
        errors.Pet_checkOut = 'Check-out date must be later than check-in date';
        document.getElementById('Pet_checkOutError').textContent = errors.Pet_checkOut;
    }

    // Validate Per Day Charge
    const per_day_charge = document.getElementById('per_day_charge');
    if (!per_day_charge.value || per_day_charge.value < 0) {
        errors.per_day_charge = 'Valid per day charge is required';
        document.getElementById('perdayChargeError').textContent = errors.per_day_charge;
    }

    // Validate Pick Up Charge
    const pick_up_charge = document.getElementById('pick_up_charge');
    if (pick_up_charge.value === '' || pick_up_charge.value < 0) {
        errors.pick_up_charge = 'Valid pick up charge is required';
        document.getElementById('pickupChargeError').textContent = errors.pick_up_charge;
    }
    
    // Validate Grooming Charge
    const grooming_charge = document.getElementById('grooming_charge');
    if (grooming_charge.value === '' || grooming_charge.value < 0) {
        errors.grooming_charge = 'Valid grooming charge is required';
        document.getElementById('groomingChargeError').textContent = errors.grooming_charge;
    }

    if (Object.keys(errors).length > 0) {
        return;
    }

    const formData = new FormData(form_data);

    fetch('/accounts/entity-booking/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('closebutton').click();
            const statusElement = document.getElementById('status');
            statusElement.innerHTML = `
                <div class="alert alert-success text-center">
                    Booking successful! Your booking ID is: ${data.booking_id}
                </div>
            `;

            this.reset();
            // Clear all form inputs
            this.querySelectorAll('input, textarea').forEach(input => {
                if (input.type !== 'submit' && input.type !== 'hidden') {
                    input.value = '';
                }
            });
            
            window.scrollTo(0, 0);
        } else {
            throw new Error(data.error?.general?.[0] || 'Booking failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const statusElement = document.getElementById('status');
        statusElement.innerHTML = `
            <div class="alert alert-danger text-center">
                ${error.message || 'Booking failed. Please try again.'}
            </div>
        `;
    });
});