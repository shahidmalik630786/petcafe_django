let id = 0 

window.onload = async (event)=>{
    get_entity_id()

}

async function get_entity_id(){
    const entity_id = localStorage.getItem("entity_id")
    try{
        const response = await(fetch(`/accounts/get-entity-details/${entity_id}/`,{
            method:"GET",
            headers:{
                "Content-Type": "Application/json"
            }
        }))
        if (response.ok){
            const data = await response.json()
            console.log(data.Parent_Name)
            id = data.id
            console.log(id)
            document.getElementById("nameProfile").textContent = data.Parent_Name || '';
            document.getElementById("emailProfile").textContent = data.Pet_Name || '';
            document.getElementById("phoneNumProfile").textContent = data.Phone_Number || '';
            document.getElementById("addressProfile").textContent = data.Pet_Breed || '';
            document.getElementById("petCheckIn").textContent = data.Pet_checkIn || '';
            document.getElementById("PetCheckOut").textContent = data.Pet_checkOut || '';
            document.getElementById("paymentStatusCheckProfile").checked = data.aggrement || false;
    
            // form
            document.getElementById("parName").value = data.Parent_Name || '';
            document.getElementById("petName").value = data.Pet_Name || '';
            document.getElementById("phoneNum").value = data.Phone_Number || '';
            document.getElementById("petBreed").value = data.Pet_Breed || '';
            document.getElementById("Pet_checkIn").value = data.Pet_checkIn || '';
            document.getElementById("Pet_checkOut").value = data.Pet_checkOut || '';
            document.getElementById("paymentStatusCheck").checked = data.aggrement || false; // Checkbox handling
            // const payment_status = document.getElementById("paymentStatusCheck"). = data.aggrement;
    
        }else{
            console.error(response.error)
        }
    }catch(error){
        console.error(error)
    }
}



const form = document.getElementById('updateForm');
    const statusElement = document.getElementById('status');

    // Validation functions


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
        debugger
        event.preventDefault(); // Prevent default form submission
        clearErrors(); // Clear previous error messages
        
        try{
            // Gather form data
            const Parent_Name = document.getElementById("parName").value.trim();
            const Pet_Name = document.getElementById("petName").value.trim();
            const Phone_Number = document.getElementById("phoneNum").value.trim();
            const Pet_Breed = document.getElementById("petBreed").value.trim();
            const Pet_checkIn = document.getElementById("Pet_checkIn").value.trim();
            const Pet_checkOut = document.getElementById("Pet_checkOut").value.trim();
            const payment_status = document.getElementById("paymentStatusCheck").value.trim();
        
            let isValid = true;

            if (!Parent_Name) {
                showError('parNameError', 'Parent Name is required');
                isValid = false;
            } 
        
            if (!Pet_Name) {
                showError('Pet_NameError', 'Pet Name is required');
                isValid = false;
            } 
        
            if (!Phone_Number) {
                showError('Phone_NumberError', 'Phone number is required');
                isValid = false;
            } else if (!validatePhone(Phone_Number)) {
                showError('Phone_NumberError', 'Invalid phone number');
                isValid = false;
            }

            if (!Pet_checkOut) {
                showError('petBreedError', 'Pet Breed is required');
                isValid = false;
            }
        
            if (!Pet_Breed) {
                showError('Pet_checkOutError', 'Pet Breed is required');
                isValid = false;
            }

            if (!Pet_checkIn) {
                showError('Pet_checkInError', 'Pet CheckIn is required');
                isValid = false;
            }

            if (!payment_status) {
                showError('payment_statusError', 'Payment Status is required');
                isValid = false;
            }
        
            if (!isValid) return;
        
            const data = {
                Parent_Name: Parent_Name,
                Pet_Name: Pet_Name,
                Phone_Number: Phone_Number,
                Pet_Breed: Pet_Breed,
                Pet_checkIn: Pet_checkIn,
                Pet_checkOut: Pet_checkOut,
                payment_status: payment_status,
            };

            const button = document.getElementById('partnershipFormSubmit');

    
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const entityid = localStorage.getItem("entity_id")

            // Send AJAX request
            console.log(entityid)
            const response = await fetch(`/accounts/update-entity-details/${id}/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify(data)
            });
    
            // Parse response
            const responseData = await response.json();
            if (response.ok){
                localStorage.setItem("entity_id", Parent_Name)
                get_entity_id()
            }

            if (!response.ok) {
                // Handle server-side validation errors
                if (responseData.error) {
                    Object.entries(responseData.error).forEach(([field, messages]) => {
                        const errorElementMap = {
                            'Parent_Name': 'parNameError',
                            'Pet_Name': 'Pet_NameError',
                            'phoneNum': 'Phone_NumberError',
                            'petBreed': 'petBreedError',
                            'Pet_checkIn': 'Pet_checkInError',
                            'Pet_checkOut': 'Pet_checkOutError',
                            'paymentStatusCheck': 'payment_statusError',
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
