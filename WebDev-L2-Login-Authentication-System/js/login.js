/**
 * Login Page Controller
 * Handles authentication form, error displays, Lucide icon password toggling, and demo auto-fill
 */

document.addEventListener('DOMContentLoaded', () => {
    // If the user already has an active session, redirect straight to the dashboard
    Auth.redirectIfAuthenticated('dashboard.html');

    const loginForm = document.getElementById('loginForm');
    const identifierInput = document.getElementById('identifier');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('rememberMe');
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const alertIconWrapper = document.getElementById('alertIconWrapper');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');
    const demoFillBtn = document.getElementById('demoFillBtn');

    // Initialize Lucide icons
    renderLucideIcons();

    // Handle incoming URL parameters (e.g. redirected from dashboard, just registered, or logged out)
    handleUrlParams();

    // Toggle password visibility with Lucide icons
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            
            // Swap Lucide icon
            togglePasswordBtn.innerHTML = isPassword
                ? `<i data-lucide="eye-off"></i>`
                : `<i data-lucide="eye"></i>`;
            
            renderLucideIcons();
        });
    }

    // Auto-fill demo credentials for evaluator testing
    if (demoFillBtn) {
        demoFillBtn.addEventListener('click', () => {
            identifierInput.value = 'alex_intern';
            passwordInput.value = 'Password123';
            clearErrors();
            showAlert('Demo credentials filled: alex_intern / Password123', 'info');
        });
    }

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const identifier = identifierInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox ? rememberCheckbox.checked : false;

        // Form validation: no empty submissions
        if (!identifier) {
            highlightError(identifierInput, 'Please enter your username or email address.');
            return;
        }

        if (!password) {
            highlightError(passwordInput, 'Please enter your password.');
            return;
        }

        // Show loading state
        setLoading(true);

        try {
            // Attempt authentication via Auth module
            const result = await Auth.login({
                identifier,
                password,
                remember
            });

            if (!result.success) {
                // Feature requirement: display clear error message without revealing which field is wrong
                showAlert(result.message, 'error', true);
                passwordInput.value = '';
                passwordInput.focus();
                setLoading(false);
                return;
            }

            // Authentication successful!
            showAlert(result.message, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 650);

        } catch (error) {
            console.error('Login error:', error);
            showAlert('An unexpected error occurred during login. Please try again.', 'error');
            setLoading(false);
        }
    });

    /**
     * Show notification alert box with appropriate Lucide icon
     * @param {string} msg 
     * @param {'error'|'success'|'info'} type 
     * @param {boolean} shake 
     */
    function showAlert(msg, type = 'info', shake = false) {
        alertBox.className = `alert-box alert-${type} show`;
        alertMessage.textContent = msg;

        if (alertIconWrapper) {
            const iconName = type === 'success' ? 'check-circle-2' : 'alert-circle';
            alertIconWrapper.innerHTML = `<i data-lucide="${iconName}" class="alert-icon"></i>`;
            renderLucideIcons();
        }

        if (shake) {
            alertBox.classList.remove('shake');
            void alertBox.offsetWidth; // Force CSS reflow
            alertBox.classList.add('shake');
        }
    }

    function clearErrors() {
        alertBox.className = 'alert-box';
        identifierInput.classList.remove('input-error');
        passwordInput.classList.remove('input-error');
    }

    function highlightError(inputElement, msg) {
        inputElement.classList.add('input-error');
        inputElement.focus();
        showAlert(msg, 'error', true);
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = 'Verifying...';
            if (btnSpinner) btnSpinner.style.display = 'inline-block';
        } else {
            btnText.textContent = 'Login';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    }

    function renderLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function handleUrlParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error') === 'unauthorized') {
            showAlert('Access Denied: You must be logged in to access the protected dashboard.', 'error', true);
        } else if (params.get('logout') === 'true') {
            showAlert('You have been logged out successfully. Safe browsing!', 'success');
        } else if (params.get('registered') === 'true') {
            showAlert('Account created successfully! You can now log in with your credentials.', 'success');
        }
    }
});
