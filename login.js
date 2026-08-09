document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = usernameInput.value;
            const password = passwordInput.value;

            // Check credentials
            if (username === 'trydannmit' && password === 'trydan123123') {

                // Remember that the user has logged in
                sessionStorage.setItem('trydanLoggedIn', 'true');

                errorMessage.style.display = 'none';

                // Open the subsystem menu
                window.location.href = 'subsystems.html';

            } else {
                errorMessage.textContent = 'Invalid username or password.';
                errorMessage.style.display = 'block';
            }
        });
    }
});