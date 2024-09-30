<?php
    include 'header.php';
?>
    <div class="form-container">
        <div class="form-toggle">
            <button id="login-toggle" onclick="toggleForm('login')">Login</button>
            <button id="register-toggle" onclick="toggleForm('register')">Register</button>
        </div>
        <form id="login-form" class="form" onsubmit="return false;">
            <h2>Login</h2>
            <input type="text" id="login-username" placeholder="Username" required>
            <input type="password" id="login-password" placeholder="Password" required>
            <button type="submit" onclick="login()">Login</button>
        </form>
        <form id="register-form" class="form" onsubmit="return false;">
            <h2>Register</h2>
            <input type="text" id="register-username" placeholder="Username" required>
            <input type="email" id="register-email" placeholder="Email" required>
            <input type="password" id="register-password" placeholder="Password" required>
            <button type="submit" onclick="register()">Register</button>
        </form>
    </div>
    <script src="JavaScript.js"></script>
</body>
</html>