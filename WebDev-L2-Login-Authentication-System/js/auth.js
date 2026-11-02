const Auth = (() => {
    const STORAGE_KEY_USERS = 'auth_system_users';
    const STORAGE_KEY_SESSION = 'auth_system_current_session';

    function pureJsSha256(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }

        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        const lengthProperty = 'length';
        let i, j;
        let result = '';

        const words = [];
        const asciiBitLength = ascii[lengthProperty] * 8;

        let hash = pureJsSha256.h = pureJsSha256.h || [];
        let k = pureJsSha256.k = pureJsSha256.k || [];
        let primeCounter = k[lengthProperty];

        const isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        ascii += '\x80';
        while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return '';
            words[i >> 2] |= j << ((3 - (i % 4)) * 8);
        }
        words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
        words[words[lengthProperty]] = asciiBitLength | 0;

        for (j = 0; j < words[lengthProperty];) {
            const w = words.slice(j, (j += 16));
            const oldHash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                const w15 = w[i - 15];
                const w2 = w[i - 2];

                const a = hash[0];
                const e = hash[4];
                const temp1 =
                    hash[7] +
                    (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                    ((e & hash[5]) ^ (~e & hash[6])) +
                    k[i] +
                    (w[i] =
                        i < 16
                            ? w[i]
                            : (w[i - 16] +
                                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                                w[i - 7] +
                                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);

                const temp2 =
                    (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (i = 0; i < 8; i++) {
            for (j = 3; j + 1; j--) {
                const b = (hash[i] >> (j * 8)) & 255;
                result += (b < 16 ? '0' : '') + b.toString(16);
            }
        }
        return result;
    }

    /**
     * Compute SHA-256 hash using Web Crypto API with pure JS fallback
     * @param {string} text - Plaintext to hash
     * @returns {Promise<string>} Hex-encoded SHA-256 digest
     */
    async function hashPassword(text) {
        if (!text) return '';
        try {
            if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && window.isSecureContext) {
                const encoder = new TextEncoder();
                const data = encoder.encode(text);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }
        } catch (e) {
            // Fallback to pure JS SHA-256
        }
        return pureJsSha256(text);
    }

    /**
     * Fetch all registered users from localStorage
     * @returns {Array<Object>}
     */
    function getUsers() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_USERS);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Failed to parse users database:', e);
            return [];
        }
    }

    /**
     * Save users array to localStorage
     * @param {Array<Object>} users 
     */
    function saveUsers(users) {
        try {
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        } catch (e) {
            console.error('Failed to save users database:', e);
            throw new Error('Local storage write failure. Please check browser permissions.');
        }
    }

    /**
     * Seed initial demo user if the store is empty
     */
    async function seedDemoUserIfEmpty() {
        const users = getUsers();
        if (users.length === 0) {
            const demoHash = await hashPassword('Password123');
            const demoUser = {
                id: 'usr_' + Date.now(),
                username: 'alex_intern',
                email: 'alex@oasis.example.com',
                passwordHash: demoHash,
                createdAt: new Date().toISOString()
            };
            saveUsers([demoUser]);
            console.log('Seeded initial demo account: alex_intern / Password123');
        }
    }

    /**
     * Check if a password meets the required validation criteria:
     * - Minimum 8 characters
     * - At least 1 number
     * @param {string} password 
     * @returns {{isValid: boolean, hasMinLength: boolean, hasNumber: boolean, errors: string[]}}
     */
    function validatePassword(password) {
        const p = password || '';
        const hasMinLength = p.length >= 8;
        const hasNumber = /\d/.test(p);
        const hasLetter = /[a-zA-Z]/.test(p);

        const errors = [];
        if (!hasMinLength) {
            errors.push('Password must be at least 8 characters long.');
        }
        if (!hasNumber) {
            errors.push('Password must contain at least 1 number (0-9).');
        }

        return {
            isValid: hasMinLength && hasNumber,
            hasMinLength,
            hasNumber,
            hasLetter,
            errors
        };
    }

    /**
     * Check if email has valid format
     * @param {string} email 
     * @returns {boolean}
     */
    function validateEmail(email) {
        if (!email) return false;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    }

    /**
     * Check if username has valid format
     * @param {string} username 
     * @returns {{isValid: boolean, message?: string}}
     */
    function validateUsername(username) {
        const u = (username || '').trim();
        if (u.length < 3) {
            return { isValid: false, message: 'Username must be at least 3 characters long.' };
        }
        if (u.length > 25) {
            return { isValid: false, message: 'Username must not exceed 25 characters.' };
        }
        if (!/^[a-zA-Z0-9_.-]+$/.test(u)) {
            return { isValid: false, message: 'Username can only contain letters, numbers, dots, and underscores.' };
        }
        return { isValid: true };
    }

    /**
     * Register a new user
     * Validates fields, checks duplicates, hashes password, saves to localStorage
     * @param {Object} data - { username, email, password }
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async function register({ username, email, password }) {
        const cleanUsername = (username || '').trim();
        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = password || '';

        // Basic form validation: no empty submissions
        if (!cleanUsername || !cleanEmail || !cleanPassword) {
            return {
                success: false,
                message: 'All fields are required. Please fill in all fields.'
            };
        }

        // Username validation
        const usernameCheck = validateUsername(cleanUsername);
        if (!usernameCheck.isValid) {
            return { success: false, message: usernameCheck.message };
        }

        // Email validation
        if (!validateEmail(cleanEmail)) {
            return { success: false, message: 'Please enter a valid email address (e.g. user@example.com).' };
        }

        // Password validation: minimum 8 characters, at least 1 number
        const passwordCheck = validatePassword(cleanPassword);
        if (!passwordCheck.isValid) {
            return {
                success: false,
                message: passwordCheck.errors.join(' ')
            };
        }

        // Duplicate username or email check
        const users = getUsers();
        const isDuplicateUsername = users.some(
            u => u.username.toLowerCase() === cleanUsername.toLowerCase()
        );
        if (isDuplicateUsername) {
            return {
                success: false,
                message: 'An account with this username already exists. Please choose a different username.'
            };
        }

        const isDuplicateEmail = users.some(
            u => u.email.toLowerCase() === cleanEmail
        );
        if (isDuplicateEmail) {
            return {
                success: false,
                message: 'An account with this email address already exists. Please use a different email or log in.'
            };
        }

        // Hash password before saving - passwords must never be stored in plain text
        const passwordHash = await hashPassword(cleanPassword);

        const newUser = {
            id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            username: cleanUsername,
            email: cleanEmail,
            passwordHash: passwordHash,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return {
            success: true,
            message: 'Account registered successfully! You can now log in.'
        };
    }

    /**
     * Authenticate user with username/email and password
     * IMPORTANT: Incorrect credential handling does NOT reveal which field is wrong
     * @param {Object} credentials - { identifier, password, remember }
     * @returns {Promise<{success: boolean, message: string, user?: Object}>}
     */
    async function login({ identifier, password, remember = false }) {
        const cleanId = (identifier || '').trim();
        const cleanPassword = password || '';

        // Form validation: no empty submissions
        if (!cleanId || !cleanPassword) {
            return {
                success: false,
                message: 'Please enter both your username/email and password.'
            };
        }

        const users = getUsers();
        const lowerId = cleanId.toLowerCase();

        // Search by username or email (case-insensitive)
        const user = users.find(
            u => u.username.toLowerCase() === lowerId || u.email.toLowerCase() === lowerId
        );

        // Security requirement: incorrect credential handling must NOT reveal which field is wrong
        const genericErrorMessage = 'Invalid username/email or password.';

        if (!user) {
            return {
                success: false,
                message: genericErrorMessage
            };
        }

        // Hash provided password to compare with stored hash
        const candidateHash = await hashPassword(cleanPassword);

        if (candidateHash !== user.passwordHash) {
            return {
                success: false,
                message: genericErrorMessage
            };
        }

        // Successful authentication: create safe session payload (NO PASSWORD OR HASH)
        const sessionPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            loginTime: new Date().toISOString()
        };

        const sessionStr = JSON.stringify(sessionPayload);

        // Store session based on 'Remember Me' preference
        if (remember) {
            localStorage.setItem(STORAGE_KEY_SESSION, sessionStr);
            sessionStorage.removeItem(STORAGE_KEY_SESSION);
        } else {
            sessionStorage.setItem(STORAGE_KEY_SESSION, sessionStr);
            localStorage.removeItem(STORAGE_KEY_SESSION);
        }

        return {
            success: true,
            message: 'Authentication successful! Redirecting...',
            user: sessionPayload
        };
    }

    /**
     * Retrieve the currently authenticated session
     * Checks sessionStorage first, then localStorage
     * @returns {Object|null}
     */
    function getCurrentUser() {
        try {
            const rawSession =
                sessionStorage.getItem(STORAGE_KEY_SESSION) ||
                localStorage.getItem(STORAGE_KEY_SESSION);

            if (!rawSession) return null;
            return JSON.parse(rawSession);
        } catch (e) {
            console.error('Error reading current session:', e);
            return null;
        }
    }

    /**
     * Log out current user by clearing active session from storage
     */
    function logout() {
        try {
            sessionStorage.removeItem(STORAGE_KEY_SESSION);
            localStorage.removeItem(STORAGE_KEY_SESSION);
        } catch (e) {
            console.error('Error during logout:', e);
        }
    }

    /**
     * Protected page guard: verifies authentication.
     * Redirects immediately to login page if no active session exists.
     * @param {string} redirectUrl 
     */
    function requireAuth(redirectUrl = 'login.html') {
        const user = getCurrentUser();
        if (!user) {
            window.location.replace(`${redirectUrl}?error=unauthorized`);
            return null;
        }
        return user;
    }

    /**
     * Redirect authenticated users away from login/register to dashboard
     * @param {string} dashboardUrl 
     */
    function redirectIfAuthenticated(dashboardUrl = 'dashboard.html') {
        const user = getCurrentUser();
        if (user) {
            window.location.replace(dashboardUrl);
        }
    }

    // Auto-seed demo account on load if storage is pristine
    seedDemoUserIfEmpty();

    return {
        hashPassword,
        validatePassword,
        validateEmail,
        validateUsername,
        register,
        login,
        getCurrentUser,
        logout,
        requireAuth,
        redirectIfAuthenticated,
        getUsers,
        seedDemoUserIfEmpty,
        STORAGE_KEY_USERS,
        STORAGE_KEY_SESSION
    };
})();

// Export globally for browser scripts and module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
