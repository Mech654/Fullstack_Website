function toggleForm(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');

    if (form === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginToggle.style.backgroundColor = '#333';
        registerToggle.style.backgroundColor = '#000';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginToggle.style.backgroundColor = '#000';
        registerToggle.style.backgroundColor = '#333';
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    alert(`Logging in with Username: ${username} and Password: ${password}`);
}

function register() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!email.includes('@')) {
        alert("You lack a '@' in your email");
        return;
    }

    alert(`Registering with Username: ${username}, Email: ${email}, and Password: ${password}`);
    callPythonFunction('Hello from JavaScript');
}


const { exec } = require('child_process');

function callPythonFunction(param) {
    exec(`python3 Python.py ${param}`, (stdout) => {
        console.log(`Output: ${stdout}`);
    });
}

