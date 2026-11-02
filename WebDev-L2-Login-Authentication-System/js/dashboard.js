document.addEventListener('DOMContentLoaded', () => {
    // Session Guard: Verify authentication immediately
    const currentUser = Auth.requireAuth('login.html');
    if (!currentUser) return; // If unauthenticated, requireAuth redirects

    // DOM Elements
    const userDisplayName = document.getElementById('userDisplayName');
    const userDisplayEmail = document.getElementById('userDisplayEmail');
    const userAvatarInitials = document.getElementById('userAvatarInitials');
    const userNavPill = document.getElementById('userNavPill');
    const infoUsername = document.getElementById('infoUsername');
    const infoEmail = document.getElementById('infoEmail');
    const infoUserId = document.getElementById('infoUserId');
    const infoAccountCreated = document.getElementById('infoAccountCreated');
    const infoLoginTime = document.getElementById('infoLoginTime');
    const sessionTimer = document.getElementById('sessionTimer');
    const storedHashDisplay = document.getElementById('storedHashDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const heroLogoutBtn = document.getElementById('heroLogoutBtn');

    // Modal elements for storage inspector
    const viewDbBtn = document.getElementById('viewDbBtn');
    const dbModal = document.getElementById('dbModal');
    const closeDbModal = document.getElementById('closeDbModal');
    const dbJsonPreview = document.getElementById('dbJsonPreview');

    // Populate user profile info
    populateUserData(currentUser);

    // Initialize Lucide icons
    renderLucideIcons();

    // Start live session duration timer
    startSessionTimer(currentUser.loginTime || new Date().toISOString());

    // Setup Logout handlers
    [logoutBtn, heroLogoutBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', handleLogout);
        }
    });

    // Setup Database Inspector Modal (shows raw localStorage to prove passwords are not stored in plaintext)
    if (viewDbBtn && dbModal) {
        viewDbBtn.addEventListener('click', () => {
            const rawUsers = Auth.getUsers();
            dbJsonPreview.textContent = JSON.stringify(rawUsers, null, 2);
            dbModal.classList.add('show');
        });
    }

    if (closeDbModal && dbModal) {
        closeDbModal.addEventListener('click', () => {
            dbModal.classList.remove('show');
        });

        // Close on background click
        dbModal.addEventListener('click', (e) => {
            if (e.target === dbModal) {
                dbModal.classList.remove('show');
            }
        });
    }

    /**
     * Populate UI elements with user data
     * @param {Object} user 
     */
    function populateUserData(user) {
        if (userDisplayName) userDisplayName.textContent = user.username;
        if (userDisplayEmail) userDisplayEmail.textContent = user.email;
        if (userNavPill) userNavPill.textContent = user.username;

        // Create avatar initials
        if (userAvatarInitials) {
            const initials = user.username.slice(0, 2).toUpperCase();
            userAvatarInitials.textContent = initials;
        }

        if (infoUsername) infoUsername.textContent = user.username;
        if (infoEmail) infoEmail.textContent = user.email;
        if (infoUserId) infoUserId.textContent = user.id;

        if (infoAccountCreated) {
            const created = user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A';
            infoAccountCreated.textContent = created;
        }

        if (infoLoginTime) {
            const login = user.loginTime ? new Date(user.loginTime).toLocaleTimeString() : new Date().toLocaleTimeString();
            infoLoginTime.textContent = login;
        }

        // Display user's SHA-256 hash from storage
        if (storedHashDisplay) {
            const allUsers = Auth.getUsers();
            const storedRecord = allUsers.find(u => u.id === user.id || u.username === user.username);
            if (storedRecord && storedRecord.passwordHash) {
                storedHashDisplay.textContent = storedRecord.passwordHash;
            } else {
                storedHashDisplay.textContent = 'Hash unavailable';
            }
        }
    }

    /**
     * Live active session timer
     * @param {string} loginTimeIso 
     */
    function startSessionTimer(loginTimeIso) {
        if (!sessionTimer) return;
        const loginTime = new Date(loginTimeIso).getTime();

        function updateTimer() {
            const now = Date.now();
            const diffSeconds = Math.max(0, Math.floor((now - loginTime) / 1000));
            const minutes = Math.floor(diffSeconds / 60);
            const seconds = diffSeconds % 60;
            sessionTimer.textContent = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    function renderLucideIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    /**
     * Logout handler: clears session and redirects to login page
     */
    function handleLogout() {
        if (confirm('Are you sure you want to log out of your account?')) {
            Auth.logout();
            window.location.replace('login.html?logout=true');
        }
    }
});

