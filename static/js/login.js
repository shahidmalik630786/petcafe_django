async function login(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    document.getElementById('error1').textContent = "";

    try {
        const response = await fetch('/accounts/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/'; // Redirect to homepage
        } else {
            if (data.error == "Partnership is not active"){
                window.location.href = "/partnership/status/"
            }
            document.getElementById('error1').textContent = data.error
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
