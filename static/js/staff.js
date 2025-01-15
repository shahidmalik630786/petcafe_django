let staff_id = 0;

function getCSRFToken() {
    let cookieValue = null;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            cookieValue = cookie.substring('csrftoken='.length, cookie.length);
            break;
        }
    }
    return cookieValue;
}


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


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('staffForm');
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
        const is_active = document.getElementById("statusCheck1").checked;
    
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
            is_active: is_active
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
            $('#staffTable').DataTable().ajax.reload(null, false);

            // Close modal
            const closeButton = document.getElementById('closebutton1');
            if (closeButton) {
                closeButton.click();
            }
    
            // Show success message
            // statusElement.textContent = 'Staff updated successfully';
            // statusElement.style.color = 'green';
    
        } catch (error) {
            console.error("Submission Error:", error);
            statusElement.textContent = 'An error occurred. Please try again.';
            statusElement.style.color = 'red';
        }
    });
});




async function insertStaff(event) {
    event.preventDefault();

    // Clear previous error messages
    const errorElements = [
        'nameError',
        'emailError', 
        'phonenumberError', 
        'addressError', 
        'password1Error', 
        'password2Error', 
    ];
    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = "";
    });

    // Collect form data
    const formData = new FormData(document.getElementById('staffpage'));
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch("/accounts/api/post/staff/", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log("Form data is submitted successfully")
            const form = document.getElementById("staffpage");
            form.reset();
            document.querySelectorAll(".error").forEach(errorElement => {
                errorElement.textContent = "";
            });
            $('#staffTable').DataTable().ajax.reload(null, false);
            const closeButton = document.getElementById('closebutton')
            if (closeButton) {
                closeButton.click();
            }
        } else {
            const errorData = await response.json();
            const statusElement = document.getElementById('status');

            if (errorData.error) {
                // Field-specific validation errors
                Object.entries(errorData.error).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach(message => {
                            const errorElementMap = {
                                'name': 'nameError',
                                'email': 'emailError',
                                'phonenumber': 'phonenumberError',
                                'address':'addressError', 
                                'password1': 'password1Error',
                                'password2': 'password2Error'
                            };

                            const errorElementId = errorElementMap[field];
                            if (errorElementId) {
                                document.getElementById(errorElementId).textContent = message;
                            }
                        });
                    }
                });
            }

            // if (errorData.error && typeof errorData.error === 'string') {
            //     statusElement.textContent = errorData.error;
            //     statusElement.style.color = 'red';
            // } else if (errorData.details) {
            //     statusElement.textContent = "Registration failed: " + errorData.details;
            //     statusElement.style.color = 'red';
            // } else {
            //     statusElement.textContent = "Registration failed. Please try again.";
            //     statusElement.style.color = 'red';
            // }
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        const statusElement = document.getElementById('status');
        statusElement.textContent = "An unexpected error occurred. Please try again later.";
        statusElement.style.color = 'red';
    }
}


function loadList() {
    try {
        staffTable = $('#staffTable').DataTable({
            "processing": true,
            "serverSide": true,  
            "ajax": {
                "url": "/accounts/api/get/staff",
                "type": "GET",
                "data": function (d) {
                    return {
                        "page": (d.start / d.length) + 1,  
                        "page_size": d.length,  
                        "search[value]": d.search.value,
                        "order[0][column]": d.order[0].column,
                        "order[0][dir]": d.order[0].dir,
                        "status": $('#staffStatus').val(),
                        "draw": d.draw
                    };
                },
                "dataSrc": function (response) {
                    return response.data;  
                }
            },
            "columns": [
                { 
                    "data": "id", 
                    "visible": false,
                    "orderable": false 
                },
                { 
                    "data": "name",
                    "orderable": true 
                },
                { 
                    "data": "email", 
                    "orderable": false 
                },

                { 
                    "data": "phonenumber", 
                    "orderable": false 
                },

                { 
                    "data": "address", 
                    "orderable": false 
                },

                {
                    "data": "is_active",
                    "orderable": false,
                    "render": function(data, type, row){
                    return data ? '<center><input  type="checkbox" checked /></center>' :'<center><input type="checkbox" disabled /></center>';
                    }
                },

                { 
                    "data": null, 
                    "render": function(data, type, row){
                        return`<center><button type="button" class="btn btn-primary" data-id="${row.id}" onclick="getStaff(${row.id})" data-bs-toggle="modal" data-bs-target="#updateModal"><i class="bi bi-pencil-square"></i></button></center>`;
                    },
                    'width':"60px"
                },
            ],
            "order": [[1, 'asc']],  
            "paging": true,
            "pageLength": 10,
            "serverMethod": "GET"
        });
    } catch (error) {
        console.error("DataTable initialization error:", error);
    }
}

// Ensure DOM is fully loaded
$(document).ready(function() {
    if ($('#staffTable').length > 0) {
     loadList();
    }
});

$('#staffStatus').change(function () {
    const staffStatus = $('#staffStatus').val();
    sessionStorage.setItem('staffStatus', staffStatus);
    $('#staffTable').DataTable().ajax.reload(null, true);  // true to reset to first page
});