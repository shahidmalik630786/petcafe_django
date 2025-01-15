var partnership_id = 0;
let partnershipTable;

function updateEntityId(email){
    localStorage.setItem("service_id", email)
}

const divMainTable = document.createElement('div')


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

function getPartnershipID(id){
    document.querySelectorAll('.error').forEach(element => {
        element.textContent = '';
    });
    partnership_id = id
    fetch(`/api/get/partnership/${id}`,{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data =>{
        if(data){
            document.getElementById("id_name").value = data.name
            document.getElementById("id_phone").value = data.phone
            document.getElementById("id_email").value = data.email
            document.getElementById("id_message").value = data.message
            document.getElementById("statusCheck").checked = data.is_active
        }else{
            console.log('No data found')
        }
    })
    .catch(error => {
    console.log('Error:', error);
    })
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('partnershipForm');
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
        // debugger
        $(".error").text('');
        event.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear previous error messages
    
        const statusElement = document.getElementById('status');

       
    
        // Gather form data
        const name = document.getElementById("id_name").value.trim();
        const email = document.getElementById("id_email").value.trim();
        const phone = document.getElementById("id_phone").value.trim();
        const message = document.getElementById("id_message").value.trim();
        const is_active = document.getElementById("statusCheck").checked;
    
        let isValid = true;

        if (!name) {
            showError('nameError', 'Name is required');
            isValid = false;
        }
    
        if (!email) {
            showError('emailError', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('emailError', 'Invalid email format');
            isValid = false;
        }
    
        if (!phone) {
            showError('phoneError', 'Phone number is required');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phoneError', 'Invalid phone number');
            isValid = false;
        }
    
        if (!message) {
            showError('messageError', 'Message is required');
            isValid = false;
        }
    
        if (!isValid) return;
    
        const data = {
            name: name,
            email: email,
            phone: phone,
            message: message,
            is_active: is_active
        };
    
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        try {
            // Send AJAX request
            const response = await fetch(`/api/put/partnership/${partnership_id}/`, {
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
                            'phone': 'phoneError',
                            'email': 'emailError',
                            'message': 'messageError',
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
    
            // Refresh table and close modal
            $('#partnershipTable').DataTable().ajax.reload(null, false);

            const closeButton = document.getElementById('closebutton');
            if (closeButton) {
                closeButton.click();
            }
    
        } catch (error) {
            console.error("Submission Error:", error);
            statusElement.textContent = 'An error occurred. Please try again.';
            statusElement.style.color = 'red';
        }
    });
});

async function insertPartnership(event) {
    event.preventDefault();

    // Clear previous error messages
    const errorElements = [
        'nameError',
        'phonenumberError', 
        'emailError', 
        'messageError', 
        'password1Error', 
        'password2Error', 
        'status'
    ];
    errorElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = "";
    });

    // Collect form data
    const formData = new FormData(document.getElementById('partnershippage'));
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch("/accounts/api/register/", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            window.location.href = '/partnership/status/';
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
                                'phonenumber': 'phonenumberError',
                                'email': 'emailError',
                                'message': 'messageError',
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

            if (errorData.error && typeof errorData.error === 'string') {
                statusElement.textContent = errorData.error;
                statusElement.style.color = 'red';
            } else if (errorData.details) {
                statusElement.textContent = "Registration failed: " + errorData.details;
                statusElement.style.color = 'red';
            } else {
                statusElement.textContent = "Registration failed. Please try again.";
                statusElement.style.color = 'red';
            }
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
        partnershipTable = $('#partnershipTable').DataTable({
            "processing": true,
            "serverSide": true,  
            "ajax": {
                "url": "/api/get/partnership",
                "type": "GET",
                "data": function (d) {
                    return {
                        "page": (d.start / d.length) + 1,  
                        "page_size": d.length,  
                        "search[value]": d.search.value,
                        "order[0][column]": d.order[0].column,
                        "order[0][dir]": d.order[0].dir,
                        "status": $('#partnershipStatus').val(),
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
                    "orderable": true,
                    "render": function(data, type, row){
                        return `<a class='text-dark' href="/accounts/services/" onclick="updateEntityId('${row.email}')" style='text-decoration:none;font-weight:400 !important;'>${row.name}</a>`
                    }
                },
                { 
                    "data": "email", 
                    "orderable": false 
                },

                { 
                    "data": "phone", 
                    "orderable": false 
                },

                { 
                    "data": "message", 
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
                        return`<center><button type="button" class="btn btn-primary" data-id="${row.id}" onclick="getPartnershipID(${row.id})" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-pencil-square"></i></button></center>`;
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

$('#partnershipTable').wrap('<div class="custom-table-container"></div>');
// Ensure DOM is fully loaded

$(document).ready(function() {
    if ($('#partnershipTable').length > 0) {
     loadList();
    }
});


$('#partnershipStatus').change(function () {
    const partnershipStatus = $('#partnershipStatus').val();
    sessionStorage.setItem('partnershipStatus', partnershipStatus);
    $('#partnershipTable').DataTable().ajax.reload(null, true);  // true to reset to first page
});