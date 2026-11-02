/**
 * Registration Page Controller
 * Handles user sign-up, real-time Lucide password criteria validation, duplicate checks, and SHA-256 password storage
 */

document.addEventListener('DOMContentLoaded', () => {
    // If user is already logged in, redirect straight to dashboard
    Auth.redirectIfAuthenticated('dashboard.html');

    const registerForm = document.getElementById('registerForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const alertIconWrapper = document.getElementById('alertIconWrapper');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const btnText = document.getElementById('btnText');

    // Requirements list elements
    const reqMinLength = document.getElementById('reqMinLength');
    const reqHasNumber = document.getElementById('reqHasNumber');
    const reqPasswordsMatch = document.getElementById('reqPasswordsMatch');

    // Initialize Lucide icons
    renderLucideIcons();

    // Password visibility toggles with Lucide icons
    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');

    // Real-time password validation indicators
    passwordInput.addEventListener('input', updatePasswordRequirements);
    confirmPasswordInput.addEventListener('input', updatePasswordRequirements);

    function updatePasswordRequirements() {
        const pass = passwordInput.value;
        const confirm = confirmPasswordInput.value;

        // Check 1: Minimum 8 characters
        const isMinLength = pass.length >= 8;
        setRequirementStatus(reqMinLength, isMinLength);

        // Check 2: At least 1 number
        const hasNumber = /\d/.test(pass);
        setRequirementStatus(reqHasNumber, hasNumber);

        // Check 3: Passwords match
        const matches = pass.length > 0 && pass === confirm;
        setRequirementStatus(reqPasswordsMatch, matches);

        renderLucideIcons();
    }

    function setRequirementStatus(element, isValid) {
        if (!element) return;
        const iconBox = element.querySelector('.req-icon-box');
        if (isValid) {
            element.classList.add('valid');
            if (iconBox) {
                iconBox.innerHTML = `<i data-lucide="check" class="req-icon"></i>`;
            }
        } else {
            element.classList.remove('valid');
            if (iconBox) {
                iconBox.innerHTML = `<i data-lucide="circle" class="req-icon"></i>`;
            }
        }
    }

    // Form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 1. Basic form validation: no empty submissions
        if (!username) {
            highlightError(usernameInput, 'Please choose a username.');
            return;
        }

        if (!email) {
            highlightError(emailInput, 'Please enter your email address.');
            return;
        }

        if (!password) {
            highlightError(passwordInput, 'Please enter a password.');
            return;
        }

        if (!confirmPassword) {
            highlightError(confirmPasswordInput, 'Please confirm your password.');
            return;
        }

        // 2. Email format validation
        if (!Auth.validateEmail(email)) {
            highlightError(emailInput, 'Please provide a valid email format (e.g., alex@oasis.example.com).');
            return;
        }

        // 3. Password requirements check: minimum 8 characters, at least 1 number
        const passwordCheck = Auth.validatePassword(password);
        if (!passwordCheck.isValid) {
            highlightError(passwordInput, passwordCheck.errors.join(' '));
            return;
        }

        // 4. Passwords match verification
        if (password !== confirmPassword) {
            highlightError(confirmPasswordInput, 'Passwords do not match. Please ensure both passwords match.');
            return;
        }

        // 5. Submit to Auth module (handles duplicate username/email checks and SHA-256 hashing)
        setLoading(true);

        try {
            const result = await Auth.register({
                username,
                email,
                password
            });

            if (!result.success) {
                // Duplicate check error displayed clearly
                showAlert(result.message, 'error', true);
                if (result.message.toLowerCase().includes('username')) {
                    usernameInput.classList.add('input-error');
                    usernameInput.focus();
                } else if (result.message.toLowerCase().includes('email')) {
                    emailInput.classList.add('input-error');
                    emailInput.focus();
                }
                setLoading(false);
                return;
            }

            // Registration successful!
            showAlert('Registration successful! Redirecting to login...', 'success');
            registerForm.reset();

            setTimeout(() => {
                window.location.href = 'login.html?registered=true';
            }, 850);

        } catch (error) {
            console.error('Registration failed:', error);
            showAlert('An unexpected error occurred during registration. Please try again.', 'error');
            setLoading(false);
        }
    });

    function setupPasswordToggle(btnId, inputId) {
        const btn = document.getElementById(btnId);
        const input = document.getElementById(inputId);
        if (!btn || !input) return;

        btn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            btn.innerHTML = isPassword
                ? `<i data-lucide="eye-off"></i>`
                : `<i data-lucide="eye"></i>`;
            renderLucideIcons();
        });
    }

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
            void alertBox.offsetWidth;
            alertBox.classList.add('shake');
        }
    }

    function clearErrors() {
        alertBox.className = 'alert-box';
        [usernameInput, emailInput, passwordInput, confirmPasswordInput].forEach(inp => {
            if (inp) inp.classList.remove('input-error');
        });
    }

    function highlightError(inputElement, msg) {
        inputElement.classList.add('input-error');
        inputElement.focus();
        showAlert(msg, 'error', true);
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            btnText.textContent = 'Registering...';
            if (btnSpinner) btnSpinner.style.display = 'inline-block';
        } else {
            btnText.textContent = 'Register';
            if (btnSpinner) btnSpinner.style.display = 'none';
        }
    }

    function renderLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }
});
