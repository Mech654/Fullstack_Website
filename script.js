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
        localStorage.setItem('username', username); 
        localStorage.setItem('password', password); 
        window.location.href = 'Profile.html'; 
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
        body: JSON.stringify({ 'username': username, 'password': password })
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

    if (data.result === 'Success') {
        const userId = data.user_id; // Assuming the response contains a user_id field
        console.log('user_id:', userId);
        localStorage.setItem("user_id", userId);
    }

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

async function sendOrderData(customer_id, product_name) {
    try {
        const response = await fetch('http://127.0.0.1:5000/logicgate_route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'customer_id': customer_id, 'product_name': product_name })
        });

        const data = await response.json();
        if (response.ok) {
            console.log('Success:', data);
           
        } else {
            console.error('Error:', data);
           
        }
    } catch (error) {
        console.error('Error:', error);

    }
}




// JavaScript to fetch and generate widgets from the database
let WidgetButtonID = {};
async function fetchWidgets() {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_dictionary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            } // Replace with your actual API endpoint
        });
        const widgetData = await response.json();

        const widgetContainer = document.getElementById('widgetContainer');
        let WidgetID = 0;
        widgetData.forEach(widget => {
            const widgetCard = document.createElement('div');
            widgetCard.className = 'widget-card';
            widgetCard.innerHTML = `
                <img src="${widget.image_path}" alt="Widget Image">
                <div class="widget-body">
                    <h5 class="widget-title">${widget.name}</h5>
                    <p class="widget-text">${widget.price}€</p>
                    <a href="#" data-Widgetid="${WidgetID}" class="widget-button">Add To Chart</a>
                </div>
            `;
            widgetContainer.appendChild(widgetCard);
            WidgetButtonID[WidgetID] = { name: widget.name };
            WidgetID++;
        });
        
    } catch (error) {
        console.error('Error fetching widget data:', error);
    }
    document.querySelectorAll('.widget-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor link behavior
    
            const widgetId = event.target.getAttribute('data-Widgetid');
            
            
            AddItemToCart(widgetId);
        });
    });
}


function AddItemToCart(widgetId) {
    let item = WidgetButtonID[widgetId].name;
    if (item) {
        user = localStorage.getItem('user_id');
        sendOrderData(user, item);

        
    }
}



