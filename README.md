# 🚀 Web Development Internship Portfolio

A consolidated repository of projects developed during the **Oasis Infobyte Internship Program (OIBSIP) — Web Development & Designing**. 

This collection features seven distinct web applications ranging from responsive static layouts to a complex, full-stack interactive client-server system. The projects progress in complexity, focusing on clean code, modern UI/UX principles, and robust architectures.

---

## 🛠️ Global Tech Stack

Across all projects, technologies scale from zero-dependency static layouts up to modern full-stack architectures:

- **Frontend & UI:** HTML5, CSS3 (Flexbox/Grid), and React JS. Styling is handled via custom CSS (Glassmorphism, animations) and Tailwind CSS.
- **Backend & Database:** Node.js, Express.js, and MongoDB for scalable data management and RESTful API endpoints.
- **JavaScript & Data Fetching:** Pure Vanilla JS (ES6+) for fundamental projects, advancing to Axios and TanStack React Query for complex asynchronous data fetching.
- **Security & Communications:** Client-side cryptographic hashing (SHA-256), secure user authentication flows, `localStorage` persistence, and Nodemailer for backend email dispatches (e.g., order confirmations and contact forms).
- **Icons & Typography:** Lucide Icons (with offline SVG fallbacks) and Google Fonts (Inter, DM Sans, Space Grotesk, Plus Jakarta Sans).

---

## 📁 Projects Directory

### 🟢 Level 1 Tasks (Foundations & UI)

#### 1. Landing Page (`WebDev-L1-LandingPage`)
**Flowspace — Work Better Together**
A static, highly responsive landing page for a fictional SaaS project management platform.
* **Key Features:** Sticky navigation, responsive CSS Grid/Flexbox layouts, hover micro-interactions, and a clean, consistent color palette.

#### 2. Personal Portfolio (`WebDev-L1-PersonalPortfolio`)
**Modern Developer Portfolio**
A sleek, dark-themed personal portfolio website designed to showcase skills, projects, and contact information.
* **Key Features:** Glassmorphism effects, floating CSS animations, responsive mobile navigation, and semantic HTML structure.

#### 3. Temperature Converter (`WebDev-L1-TemperatureConverterWebsite`)
**ThermoShift Interactive Converter**
A robust utility tool for real-time temperature conversions between Celsius, Fahrenheit, and Kelvin.
* **Key Features:** Real-time mathematical validation, thermodynamic absolute zero enforcement, simultaneous multi-unit output, and dynamic thermal state badges (e.g., Cryogenic, Extreme Heat).

---

### 🔵 Level 2 Tasks (Logic & Application State)

#### 4. Calculator (`WebDev-L2-Calculator`)
**Modern Browser Calculator**
A beautifully styled, grid-based calculator built for accurate arithmetic operations.
* **Key Features:** BODMAS/PEMDAS adherence, full keyboard navigation support, sequential operator chaining, division-by-zero protection, and dual-line history display.

#### 5. Login Authentication System (`WebDev-L2-Login-Authentication-System`)
**Secure Client-Side Auth (AuthGuard)**
A complete frontend authentication flow simulating a secure login/registration environment.
* **Key Features:** Client-side SHA-256 cryptographic hashing (no plaintext passwords), `localStorage` database simulation, strict password criteria validation, duplicate user checks, and protected dashboard routing.

#### 6. To-Do Web App (`WebDev-L2-To-Do-Web-App`)
**TaskMaster**
A feature-packed task management application for daily workflow organization.
* **Key Features:** Persistent `localStorage`, inline task editing, priority tagging (High/Medium/Low), live search filtering, detailed timestamps, and a functional Light/Dark mode toggle.

---

### 🟣 Level 3 Tasks (Full-Stack & Backend Integration)

#### 7. Pizza Delivery App (`WebDev-L3-Pizza-Delivery-Full-Stack-Application`)
**Full-Stack Food Ordering Platform**
A complete, end-to-end MERN stack web application for browsing, ordering, and managing pizza deliveries. 
* **Key Features:** User authentication, dynamic menu rendering, interactive shopping cart, secure order placement, and automated email notifications dispatched via Nodemailer.
* **Tech Stack:** MongoDB, Express.js, React JS, Node.js, Tailwind CSS, and Axios.

---

## 🚀 Getting Started (How to Run)

### Level 1 & Level 2 Projects (Static/Frontend-Only)
Because these projects are built with pure HTML, CSS, and JavaScript, they require zero build tools.
* **Direct Launch:** Navigate to any L1 or L2 project folder and double-click `index.html`.
* **Local Server (Recommended):** Use the VS Code **Live Server** extension, or run `python -m http.server 8000` in the project root and visit `http://localhost:8000`. 
* *Note: The Level 2 Auth System includes an optional `server.js` for testing via Node.js (`node server.js`).*

### Level 3 Project (Full-Stack MERN)
This project requires Node.js and a MongoDB instance to run.
1. Open your terminal and navigate to the `WebDev-L3-Pizza-Delivery-Full-Stack-Application` directory.
2. Install dependencies for both the backend and frontend (`npm install` in their respective directories).
3. Configure your `.env` variables (MongoDB URI, Nodemailer SMTP credentials, JWT secrets, etc.).
4. Start the backend server (`npm run server`) and the frontend client (`npm run client` or `npm start`).

---

## 👨‍💻 Author

**Midhun M**  
*Full Stack Developer*  
Designed and built with care for the Oasis Infobyte Internship Program.

* **GitHub:** [MidhunSreekkuttan](https://github.com/MidhunSreekkuttan)
* **LinkedIn:** [Midhun Sreekkuttan](https://linkedin.com/in/midhun-sreekkuttan)