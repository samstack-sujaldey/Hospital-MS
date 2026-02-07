const authForm = document.getElementById('authForm');
const toggleAuth = document.getElementById('toggleAuth');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const submitBtn = document.getElementById('submitBtn');
const toggleText = document.getElementById('toggleText');
const demoCredentials = document.getElementById('demoCredentials');

let isLogin = true;

toggleAuth.addEventListener('click', (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.textContent = 'Welcome back';
        formSubtitle.textContent = 'Please sign in to your account';
        submitBtn.textContent = 'Sign In';
        toggleText.innerHTML = 'Don\'t have an account? <a href="#" id="toggleAuth">Sign Up</a>';
        if (demoCredentials) demoCredentials.style.display = 'block';
    } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Get started with your free account';
        submitBtn.textContent = 'Sign Up';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="toggleAuth">Sign In</a>';
        if (demoCredentials) demoCredentials.style.display = 'none';
    }

    // Re-attach listener since innerHTML replaced it
    document.getElementById('toggleAuth').addEventListener('click', (e) => {
        // Just trigger the outer listener manually or reload page logic? 
        // Simpler: reload page or better yet, just toggle the boolean and update UI again
        // Actually, replacing innerHTML removes the element, so the listener on 'toggleAuth' is gone.
        // Better to just update the text node if possible, but the structure changes.
        // Let's just reload implementation for simplicity or use a recursive function.
        location.reload(); // Simplest for this demo to reset state if they want to switch back
    });
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token); // Store token

            // Role-based Redirect
            if (data.user.role === 'admin') {
                window.location.href = '/admin-dashboard.html';
            } else if (data.user.role === 'doctor') {
                window.location.href = '/doctor-dashboard.html';
            } else {
                window.location.href = '/dashboard';
            }
        } else {
            alert(data.message || 'Authentication failed');
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred. Please try again.');
    }
});
