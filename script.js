function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');

    if (formType === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginToggle.classList.add('active');
        registerToggle.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginToggle.classList.remove('active');
        registerToggle.classList.add('active');
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    alert(`Logging in with Username: ${username} and Password: ${password}`);
    
    callPythonLogin(username, password).then(response => {
        if (response.result !== 'Success') {
            alert('Login failed. Please try again.');
            return;
        }
        localStorage.setItem('username', username); // Store username in localStorage
        localStorage.setItem('password', password); // Store password in localStorage
        window.location.href = 'Profile.html'; // Redirect to profile.html
    }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    alert(`Registering with Username: ${username}, Email: ${email}, and Password: ${password}`);
    
    callPythonRegister(username, email, password).then(response => {
        if (response.result !== 'Success') {
            alert('Registration failed. Please try again.');
            return;
        }
        alert('Registration successful!');
    }).catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

function showAccount(user) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('account').style.display = 'block';
    document.getElementById('user-name').innerText = user.username;
    document.getElementById('user-email').innerText = user.email;
}

async function callPythonLogin(username, password) {
    console.log('Sending POST request to Flask with username:', username, 'password:', password);
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    });
    const data = await response.json();
    console.log('Response from Flask:', data.result);
    return data;
}

async function callPythonRegister(username, email, password) {
    console.log('Sending POST request to Flask with username:', username, 'email:', email, 'password:', password);
    const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, email: email, password: password })
    });
    const data = await response.json();
    console.log('Response from Flask:', data.result);
    return data;
}

function fetchUserData(username) {
    fetch(`http://127.0.0.1:5000/user/${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.result === 'Success') {
                document.getElementById('user-name').innerText = data.user.username;
                document.getElementById('user-email').innerText = data.user.email;
            } else {
                alert('Failed to fetch user data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching user data');
        });
}