# 🛡️ Secure Client-Side Authentication System

**Oasis Infobyte Internship Program (OIBSIP) — Web Development & Designing — Level 2 Task**

A secure, responsive, modern client-side authentication system built with **HTML5, CSS3, and JavaScript (ES6+)**, utilizing **Browser LocalStorage** and **SHA-256 Cryptographic Hashing**.

---

## 📌 Objective & Tech Stack Approach

* **Approach Selected:** **(A) Front-End Only: HTML5 / Modern CSS / JavaScript (ES6+) with `localStorage` and SHA-256 Hashing**.
* **Zero Dependencies Required:** Runs directly in any web browser without build tools or external packages. Also includes an optional lightweight zero-dependency Node.js static server for local testing.

---

## ✅ Feature Checklist Compliance

| Feature Requirement | Status | Implementation Details |
| :--- | :---: | :--- |
| **Registration Page** | ✅ Complete | Fields for username, email, password, and confirm password with a "Register" button. |
| **Password Validation on Registration** | ✅ Complete | Validates minimum **8 characters** and at least **1 number (0–9)**. Real-time visual status badges indicate requirement progress. |
| **Duplicate Username / Email Check** | ✅ Complete | Verifies `auth_system_users` store before saving. Rejects duplicate usernames and emails with descriptive alerts. |
| **Login Page** | ✅ Complete | Fields for username or email and password, with a "Login" button and "Remember Me" option. |
| **Incorrect Credential Handling** | ✅ Complete | Returns a non-revealing error message: `Invalid username/email or password.` (never indicates which field is incorrect, preventing user enumeration). |
| **Protected / Dashboard Page** | ✅ Complete | Synchronously executes session checks in the `<head>` tag before DOM rendering. Direct unauthorized visits are instantly redirected to `login.html?error=unauthorized`. |
| **Logout Button on Dashboard** | ✅ Complete | Clears current session from `localStorage`/`sessionStorage` and redirects back to `login.html?logout=true`. |
| **No Plain-Text Passwords (SHA-256)** | ✅ Complete | Passwords are cryptographically digested into 64-character hex strings using the browser's native **Web Crypto API (`crypto.subtle.digest`)** with an integrated pure JS SHA-256 fallback. Raw passwords are never persisted. |
| **Basic Form Validation** | ✅ Complete | Form submissions prevent whitespace-only or empty fields, validate email syntax, and highlight invalid inputs with shake animations. |

---

## 📂 Project Architecture

```
WebDev-L2-Login-Authentication-System/
├── index.html           # Root entry point; auto-redirects based on active session state
├── login.html           # Sign-in page with Lucide icons & demo filler
├── register.html        # Sign-up page with real-time Lucide password criteria checklist
├── dashboard.html       # Protected dashboard with session metrics & database inspector
├── css/
│   └── styles.css       # Complete modern UI styling (Lucide icon styling, glassmorphism, responsive)
├── js/
│   ├── auth.js          # Core security engine (SHA-256 hashing, storage management, session guards)
│   ├── login.js         # Login page UI interactions and error handling
│   ├── register.js      # Registration form validation, duplicate checking, and event listeners
│   ├── dashboard.js     # Protected route data population, live timer, and logout handlers
│   └── lucide-fallback.js # Standalone Lucide icons engine (ensures icons render online and offline)
├── server.js            # Optional zero-dependency local static HTTP server (Node.js)
├── package.json         # NPM package configuration with start script
└── README.md            # Comprehensive project documentation
```

---

## 🚀 How to Run the Application

You can run this project in **two ways**:

### Option 1: Direct File Open (Zero Setup)
1. Navigate to the project directory in your file explorer.
2. Double-click `login.html` or `index.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Node.js)
If you have Node.js installed and prefer running via `localhost`:
```bash
# Start the local server
node server.js
# Or via npm:
npm start
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Quick Test Credentials

For effortless evaluator testing, the application pre-seeds an initial demo user on first launch:

* **Username:** `alex_intern`
* **Password:** `Password123`
* **Email:** `alex@oasis.example.com`

> 💡 **Tip:** On the `login.html` page, click the **"Auto-Fill Demo Credentials"** button to populate these credentials with one click!

### Testing Walkthrough:
1. **Try Direct Access to Protected Page:** Open `dashboard.html` directly in your browser. Notice you are immediately bounced to `login.html?error=unauthorized` with an "Access Denied" message.
2. **Try Logging In With Bad Password:** Enter `alex_intern` with password `WrongPass123`. Observe the generic error: `Invalid username/email or password.`
3. **Log In Successfully:** Log in with `alex_intern` / `Password123`. You are taken to the protected dashboard.
4. **Inspect Password Hashing:** On the dashboard, view the **"Security & Hashing"** card or click **"Inspect Database Records (JSON)"** to confirm the password is saved solely as a 64-character SHA-256 hex digest (`ef92b778bafe...`).
5. **Log Out:** Click the "Logout" button. Your session is terminated and you are returned to the login screen with a success banner.
6. **Register a New Account:** Go to `register.html`:
   - Try registering with username `alex_intern` (duplicate check fails).
   - Try a short password (fails length requirement).
   - Try a password without numbers (fails number requirement).
   - Enter valid details (e.g., `developer1`, `dev@example.com`, `SecurePass99`). Registration succeeds and redirects you to login!

---

## 🔐 Security Highlights

1. **SHA-256 Client-Side Hashing:** Passwords are never stored in plain text. When a user registers or logs in, their password passes through SHA-256 before verification or persistence.
2. **Generic Authentication Failures:** In accordance with OWASP authentication best practices, invalid credentials fail with an identical generic message to prevent account enumeration.
3. **Session Guard in Document `<head>`:** The authentication check executes synchronously at the very top of `dashboard.html` to prevent any flash of unauthenticated content (FOUC).
4. **XSS & Injection Mitigation:** Input values are sanitized and handled using safe DOM manipulation APIs (`textContent`).

---

## 👨‍💻 Author & Internship Details

* **Program:** Oasis Infobyte Internship (OIBSIP)
* **Domain:** Web Development and Designing
* **Task:** Level 2 — Task 2: Login Authentication System

