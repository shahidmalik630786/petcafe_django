
let staff_id = 0;

function getStaff(id){
    staff_id  = id
    document.querySelectorAll('.error').forEach(element => {
        element.textContent = '';
    });
    partnership_id = id
    fetch(`/accounts/api/get/staff/${id}`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data =>{
        if(data){
            document.getElementById("id_name1").value = data.name
            document.getElementById("id_phone1").value = data.phonenumber
            document.getElementById("id_email1").value = data.email
            document.getElementById("id_address1").value = data.address
            document.getElementById("statusCheck1").checked = data.is_active
        }else{
            console.log('No data found')
        }
    })
    .catch(error => {
    console.log('Error:', error);
    })
}

function getStaffProfile(id){
    staff_id  = id
    document.querySelectorAll('.error').forEach(element => {
        element.textContent = '';
    });
    partnership_id = id
    fetch(`/accounts/api/get/staff/${id}`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data =>{
        if(data){
            document.getElementById("name_profile").textContent = data.name || 'Not provided';
            document.getElementById("email_profile").textContent = data.email || 'Not provided';
            document.getElementById("phonenumber_profile").textContent = data.phonenumber || 'Not provided';
            document.getElementById("address_profile").textContent = data.address || 'Not provided';
        }else{
            console.log('No data found')
        }
    })
    .catch(error => {
    console.log('Error:', error);
    })
}

// document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('updateForm');
    const statusElement = document.getElementById('status');

    // Validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        return re.test(phone);
    }

    // Clear error messages
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(error => {
            error.textContent = "";
        });
        statusElement.textContent = "";
    }

    // Show error
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Form submission handler
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear previous error messages
    
        // Gather form data
        const name = document.getElementById("id_name1").value.trim();
        const email = document.getElementById("id_email1").value.trim();
        const phone = document.getElementById("id_phone1").value.trim();
        const address = document.getElementById("id_address1").value.trim();
    
        let isValid = true;

        // Validate name
        if (!name) {
            showError('nameError1', 'Name is required');
            isValid = false;
        } 
    
        // Validate email
        if (!email) {
            showError('emailError1', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('emailError1', 'Invalid email format');
            isValid = false;
        }
    
        // Validate phone
        if (!phone) {
            showError('phoneError1', 'Phone number is required');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phoneError1', 'Invalid phone number');
            isValid = false;
        }
    
        // Validate address
        if (!address) {
            showError('addressError1', 'Address is required');
            isValid = false;
        }
    
        // Stop if validation fails
        if (!isValid) return;
    
        // Prepare data payload
        const data = {
            name: name,
            email: email,
            phone: phone,
            address: address,
        };
    
        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        try {
            // Send AJAX request
            const response = await fetch(`/accounts/api/put/staff/${staff_id}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            });
    
            // Parse response
            const responseData = await response.json();

            if (!response.ok) {
                // Handle server-side validation errors
                if (responseData.error) {
                    Object.entries(responseData.error).forEach(([field, messages]) => {
                        const errorElementMap = {
                            'name': 'nameError1',
                            'phone': 'phoneError1',
                            'email': 'emailError1',
                            'address': 'addressError1',
                        };
    
                        const errorElementId = errorElementMap[field];
                        if (errorElementId) {
                            const errorElement = document.getElementById(errorElementId);
                            if (errorElement && Array.isArray(messages)) {
                                errorElement.textContent = messages[0];
                            }
                        }
                    });
                    return;
                }
    
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Reset form
            form.reset();
    
            // Reload DataTable
            getStaffProfile(staff_id)

            // Close modal
            const closeButton = document.getElementById('closebutton1');
            if (closeButton) {
                closeButton.click();
            }
    
        } catch (error) {
            console.error("Submission Error:", error);
            statusElement.textContent = 'An error occurred. Please try again.';
            statusElement.style.color = 'red';
        }
    });

    
    const staffForm = document.getElementById('updatePasswordForm');
    staffForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear previous error messages

        const email = staffForm.dataset.email;

        const password1 = document.getElementById("id_password1").value.trim();
        const password2 = document.getElementById("id_password2").value.trim();
    
        let isValid = true;
    
        // Validate passwords
        if (!password1) {
            showError('password1Error', 'New password is required');
            isValid = false;
        } else if (password1.length < 8) {
            showError('password1Error', 'Password must be at least 8 characters long');
            isValid = false;
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password1)) {
            showError('password1Error', 'Password must include letters, numbers, and special characters');
            isValid = false;
        }

        if (!password2) {
            showError('password2Error', 'Confirm password is required');
            isValid = false;
        }

        if (password1 !== password2) {
            showError('password2Error', 'The two password fields didn\'t match');
            isValid = false;
        }

    
        // Stop if validation fails
        if (!isValid) return;
    
        // Prepare data payload
        const data = {
            password1: password1,
            password2: password2,
        };
    
        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        try {
            // Send AJAX request
            const response = await fetch(`/accounts/api/update/password/${email}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            });
    
            // Parse response
            const responseData = await response.json();
    
            if (!response.ok) {
                // Handle server-side validation errors
                if (responseData.error) {
                    Object.entries(responseData.error).forEach(([field, messages]) => {
                        const errorElementMap = {
                            'password1': 'password1Error',
                            'password2': 'password2Error',
                            'password': 'password2Error'
                        };
    
                        const errorElementId = errorElementMap[field];
                        if (errorElementId) {
                            const errorElement = document.getElementById(errorElementId);
                            if (errorElement && Array.isArray(messages)) {
                                errorElement.textContent = messages[0];
                            }
                        }
                    });
                    return;
                }
    
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Reset form
            form.reset();
    
            // Close modal
            const closeButton = document.getElementById('closebutton2');
            if (closeButton) {
                closeButton.click();
            }
    
    
        } catch (error) {
            console.error("Submission Error:", error);
            // Optional: Show error message
            alert('An error occurred. Please try again.');
        }
    });
    
// });


