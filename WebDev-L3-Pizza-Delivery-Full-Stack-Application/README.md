# 🍕 PizzaCraft — Full-Stack Artisanal Pizza Platform & Inventory Management

> A production-grade, full-stack pizza ordering and inventory orchestration platform featuring real-time WebSocket order tracking, 4-step custom pizza builder, Razorpay payment gateway integration, separate Admin & Customer roles, automatic ingredient stock decrement, and scheduled cron alerts for low inventory.

---

## 📋 Feature Checklist Matrix

### 👤 User Side
- [x] **User Registration with Email Verification**: Cryptographic token generation, verification link via Nodemailer with HTML email template, activation endpoint.
- [x] **User Login with JWT Authorisation**: Secure password hashing via `bcryptjs`, JWT bearer token generation, authentication middleware, and route protection.
- [x] **Forgot Password Flow**: Email-based password reset token with 1-hour expiry and secure reset screen.
- [x] **Dashboard Displaying Available Pizza Varieties**: Filterable catalog of wood-fired Neapolitan pizzas with ingredient breakdowns, prices, ratings, and dietary badges.
- [x] **Custom Pizza Builder Flow (4-Step Wizard)**:
  - **Step 1**: Choose a pizza base (5 options: *Thin Crust, Hand-Tossed Classic, Cheese Burst, Whole Wheat Crust, Gluten-Free Cauliflower Crust*)
  - **Step 2**: Choose a sauce (5 options: *San Marzano Marinara, Spicy Peri-Peri, Creamy Garlic Alfredo, Smoky Hickory BBQ, Basil & Pine Nut Pesto*)
  - **Step 3**: Choose a cheese type (*Whole Milk Mozzarella, Cheddar Blend, Ricotta & Parmesan, Smoked Provolone, Vegan Mozzarella*)
  - **Step 4**: Choose vegetables (*Multiple select: Bell Peppers, Olives, Jalapeños, Onions, Mushrooms, Sun-dried Tomatoes, Sweet Corn, Baby Spinach*)
- [x] **Live Artisan Pizza Visualizer**: Dynamic visual representation updating sauce color, cheese melt, and toppings in real time as selections are made.
- [x] **Order Summary & Review**: Itemized bill breakdown with Subtotal, GST (5%), Delivery fee calculations, and voucher support (`PIZZA50`, `CRUST100`).
- [x] **Razorpay Checkout Integration (Test Mode)**: Seamless Razorpay modal integration with test mode signature validation; clicking "Success" confirms the order.
- [x] **Real-Time Order Status Tracking**: Live dashboard timeline tracking transitions:
  $$\text{Order Received} \longrightarrow \text{In Kitchen} \longrightarrow \text{Sent to Delivery} \longrightarrow \text{Delivered}$$
  Powered by **Socket.io WebSockets** with automatic 5-second polling fallback!

### 👨‍🍳 Admin Side
- [x] **Separate Admin Login**: Dedicated administrative portal (`/admin/login`), strictly segregated from the customer registration workflow with `requireAdmin` role verification.
- [x] **Inventory Management Dashboard**: Live ingredient stocks categorized by Bases, Sauces, Cheeses, and Vegetables with safety threshold indicators.
- [x] **Automatic Stock Decrement**: Atomically decrements the exact inventory counts for base, sauce, cheese, and vegetables upon every confirmed order.
- [x] **Manual Stock Update Capability**: Quick adjustments (+10, +50, -5) and detailed modal editor for exact quantities and custom thresholds.
- [x] **Automated Scheduled Low-Stock Notifications**: Background scheduled job using `node-cron` scanning inventory for items below safety threshold ($< 20$ units) and emailing alerts to the admin (plus instant manual test trigger button).
- [x] **Order Management & Kitchen Dispatch Panel**: Incoming order feed with filterable states, customer delivery details, item customizations, and 1-click status advancement buttons.
- [x] **Real-Time Status Synchronization**: Updating an order status in the Admin panel instantly broadcasts via WebSockets to the customer's open tracker.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Tailwind CSS, Lucide React, Socket.io Client, Canvas Confetti |
| **Backend** | Node.js (ESM), Express.js, Socket.io, Mongoose, JWT, BcryptJS, Nodemailer, Node-Cron, Morgan |
| **Database** | MongoDB (Supports MongoDB Atlas, Local MongoDB, or Autonomous MongoMemoryServer fallback) |
| **Payments** | Razorpay SDK (Test Mode / Instant Test Mode simulation) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20/v24)
- **npm** v9+

### 2. Installation
Install all root, backend, and frontend dependencies:
```bash
# In the root repository directory
npm --prefix backend install
npm --prefix frontend install
```

### 3. Environment Configuration
The backend comes pre-configured with default development settings in `backend/.env`.
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pizza_delivery
JWT_SECRET=pizzacraft_super_secure_jwt_secret_key_2026_dev
ADMIN_EMAIL=admin@pizzacraft.com
ADMIN_PASSWORD=Admin@123456
LOW_STOCK_THRESHOLD=20
ALERT_CRON_SCHEDULE=*/5 * * * *
```
*(Note: If local MongoDB is not running on your machine, the backend will automatically initialize an embedded `MongoMemoryServer` so you can run the entire platform with zero external database configuration!)*

### 4. Running the Application

**Option A: Single Command from Root (Zero Root Dependencies)**
```bash
npm run dev
```
*(Uses the native `start-dev.js` runner to launch both Backend and Frontend concurrently).*

**Option B: Separate Terminals**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open your browser at:
- **Customer Storefront**: [http://localhost:5173](http://localhost:5173)
- **Admin Kitchen Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Features / Access |
|---|---|---|---|
| **Administrator** | `admin@pizzacraft.com` | `Admin@123456` | Full Inventory Control, Restocking, Low-Stock Cron Alerts, Order Dispatch Panel |
| **Customer** | `customer@pizzacraft.com` | `User@123456` | Verified account, Menu Ordering, 4-Step Pizza Builder, Real-time Tracker |

*(Both login screens include convenient **"Auto-fill"** buttons for immediate testing!)*

---

## 🧪 Automated End-to-End Verification

To execute the automated 14-point test suite covering Registration, Verification, Login, Builder, Payment, Stock Decrement, Admin Login, Restock, and Order Status Updates:

```bash
npm run test:e2e
```

---

## 📡 API Endpoints Overview

### Auth & Security (`/api/auth`)
- `POST /register`: Registers new customer & generates verification token
- `GET /verify-email?token=...`: Activates account via email link
- `POST /login`: Authenticates customer and returns JWT
- `POST /admin-login`: Dedicated administrative login
- `POST /forgot-password`: Generates reset link
- `POST /reset-password/:token`: Sets new password

### Pizzas & Menu (`/api/pizzas`)
- `GET /`: Lists all signature pizza varieties
- `GET /:id`: Retrieves single pizza details

### Inventory & Stock (`/api/inventory`)
- `GET /`: Lists all inventory components with stock levels
- `GET /builder-options`: Returns options grouped by Base, Sauce, Cheese, Vegetables
- `PUT /:id`: Admin update of stock quantity & threshold
- `PATCH /:id/adjust`: Quick restock increment/decrement
- `POST /trigger-alert`: Instant trigger of the low-stock alert cron job

### Orders & Tracking (`/api/orders`)
- `POST /`: Creates new order and atomically decrements inventory stock
- `GET /my-orders`: Returns customer order history
- `GET /:id`: Fetches live status of specific order
- `GET /`: Admin view of all orders across platform
- `PATCH /:id/status`: Admin update of order status with real-time WebSocket broadcast

### Payments (`/api/payment`)
- `POST /create-order`: Generates Razorpay transaction order
- `POST /verify`: Validates Razorpay transaction signature

---

## 📦 Project Structure

```
WebDev-L3-Pizza-Delivery-Full-Stack-Application/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Mailer, and Razorpay setup
│   │   ├── controllers/     # Auth, Pizza, Inventory, Order, Payment handlers
│   │   ├── middleware/      # JWT Protect & RequireAdmin route guards
│   │   ├── models/          # User, Inventory, Pizza, Order schemas
│   │   ├── routes/          # Express route declarations
│   │   ├── seed/            # Pre-seeded admin, pizzas, and 23 inventory items
│   │   ├── services/        # Socket.io, Email templates, and node-cron scheduler
│   │   └── server.js        # Server bootstrap & socket initialization
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Centralized API fetch client with JWT injection
│   │   ├── components/      # Navbar, Footer, PizzaCard, PizzaVisualizer, OrderTimeline
│   │   ├── context/         # AuthContext, CartContext, SocketContext
│   │   ├── pages/
│   │   │   ├── user/        # Home, CustomPizzaBuilder, Cart, Checkout, OrderTracking, Auth
│   │   │   └── admin/       # AdminLogin, AdminDashboard, AdminInventory, AdminOrders
│   │   ├── App.jsx          # Route definitions & guards
│   │   └── main.jsx
│   └── package.json
├── test_e2e.js              # Automated E2E verification test suite
└── README.md
```

---

## 🍕 PizzaCraft Platform Architecture Highlights

1. **Transactional Inventory Decrement**: When a custom or pre-made pizza is ordered, each component (e.g. 1 base, 1 sauce, 1 cheese portion, and 1 unit per selected vegetable) is deducted from the MongoDB inventory collection.
2. **Scheduled Low-Stock Notifications**: A background job running via `node-cron` evaluates ingredient quantities against configurable thresholds. If stock dips below safety limits, an email is automatically formatted and sent to the administrator.
3. **Reactive WebSocket Order Tracking**: As the kitchen team advances an order (`Order Received` $\rightarrow$ `In Kitchen` $\rightarrow$ `Sent to Delivery`), Socket.io broadcasts the event to the customer room, triggering visual timeline updates without requiring a manual page refresh.

