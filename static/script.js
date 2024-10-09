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

    const loginData = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.result === 'Success') {
            localStorage.setItem('user_id', data.user.User_ID);
            localStorage.setItem('username', data.user.username);
            // Redirect to the home page
            window.location.href = homeUrl; // Use the global variable
        } else {
            console.error('Login failed:', data.message);
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}


function showAccount(user) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('account').style.display = 'block';
    document.getElementById('user-name').innerText = user.username;
    document.getElementById('user-email').innerText = user.email;
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

function callPythonLogin() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Ensure you are capturing the data correctly
    const loginData = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        // Assuming the server returns a user_id in the response
        if (data.user_id) {
            localStorage.setItem('user_id', data.user_id); // Store user_id in localStorage
            // Perform other actions (e.g., navigate to another page)
        } else {
            console.error('Login failed:', data.message); // Handle login failure
        }
    })
    .catch(error => {
        console.error('Error:', error); // Handle fetch error
    });
}

async function callPythonRegister(username, email, password) {
    console.log('Sending POST request to Flask with username:', username, 'email:', email, 'password:', password);
    const response = await fetch('https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'username': username, 'email': email, 'password': password })
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
    fetch(`https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net/user/${username}`)
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
        const response = await fetch('https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net/logicgate_route', {
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

function AddItemToCart(widgetId) {
    let item = WidgetButtonID[widgetId].name;
    if (item) {
        let user = localStorage.getItem('user_id');
        sendOrderData(user, item);
    }
}

let WidgetButtonID = {};
let fetchWidget = "false";

async function fetchWidgets() {
    console.log('Fetching widgets...');
    if (fetchWidget = "false") {
        IsWidgetAlive = true;
        WidgetButtonID = {};
        try {
            const response = await fetch('https://flaskapp-fahsabdxgzbteaet.northeurope-01.azurewebsites.net/get_dictionary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
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
                <button data-Widgetid="${WidgetID}" class="widget-button">Add To Cart</button>
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
                event.preventDefault(); // Prevent default behavior to avoid refresh
                const widgetId = event.target.getAttribute('data-Widgetid');
                AddItemToCart(widgetId);
            });
        });
    } else {
        console.log('Widgets already fetched');
    }
}
