# Inventory Management System (Full Stack CRUD Application)

A secure, responsive, and scalable full-stack Inventory Management System built using the MERN stack (MongoDB, Express, React, Node.js). This project satisfies all functional requirements, backend REST APIs, validations, responsive UI expectations, and several advanced features.

---

## Key Features

### 1. Secure Authentication & Authorization
* **Double-Token Auth**: Signs a **15-minute Access Token** (sent in response body) and a **7-day Refresh Token** (stored securely in an `HttpOnly`, `SameSite` secure cookie).
* **Silent Token Refresh**: Automated Axios interceptors on the frontend catch expired access tokens (401 errors), query `/auth/refresh` silently to update local storage, and replay the failed requests seamlessly without interrupting the user.
* **Role-Based Access Control (RBAC)**: Separates operations between:
  * **Admin**: Full access to dashboard metrics, product CRUD (Add, Edit, Delete), category management (Add, Edit, Delete), and stock level adjustments.
  * **User**: Read-only access to products/categories, with view permission for dashboard metrics and logs.

### 2. Dashboard Analytics & Visualization
* Summary KPI cards representing:
  * **Total Products**
  * **Total Categories**
  * **Total Stock Quantity**
  * **Low Stock Items** (Automatically flagged when quantity is $\le 10$)
  * **Out of Stock Items**
* Recharts integration displaying a **Category Breakdown Bar Chart** and a **Stock Status Pie Chart**.
* A live **Recent Activities** panel logging transaction movements in real-time.

### 3. Product & Category CRUD (Modular Design)
* Clean, modular, and reusable layout components (`Card`, `ConfirmDeleteModal`, generic `AddModal` and `EditModal` shared by both category and product modules).
* Products contain fields for: Product Name, unique SKU, Category reference, Description, Unit Price, Quantity, Supplier Name, Status, and Timestamps.

### 4. Advanced Inventory Features
* **Stock Adjustments**: Increase stock (Stock In), decrease stock (Stock Out), or perform stock Correction (Adjustment) with notes.
* **Audit Trail / Transaction Logs**: Automatically records stock movements (what changed, by how much, ending quantity, performer, timestamp, and notes).
* **QR Code Generator**: Generates a live QR code representing the product's unique SKU.
* **Cloudinary Image Upload**: Seamlessly uploads product pictures using Multer memory storage and streams buffers directly to Cloudinary.
* **Search, Filter, Sort, & Pagination**:
  * Live search by product name or SKU.
  * Filters for categories and stock status.
  * Sorting options by date created, name, quantity, or unit price.
  * Server-side paginated product table.

### 5. Styling & Theme
* Tailored styling using **Vanilla Tailwind CSS**.
* Modern glassmorphism layout with a fully-functional **Dark/Light Mode toggle** defaulting to **Light Mode** as the primary theme, persisting preference in `localStorage`.

---

## Project Architecture

```text
Inventory/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection and Cloudinary setups
│   │   ├── controllers/     # Controller logics (Auth, Products, Categories)
│   │   ├── middleware/      # Auth protection, Admin checkers, and Multer upload
│   │   ├── models/          # Mongoose schemas (User, Product, Category, Transaction)
│   │   ├── routes/          # Express routing (auth, products, categories)
│   │   └── app.js           # Server initializer, CORS, & Cookie Parser
│   ├── server.js            # Node listener entrypoint
│   └── .env.example         # Template for environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable subcomponents (Modals, Card, Sidebar, Header)
│   │   ├── context/         # AuthProvider & ThemeProvider
│   │   ├── hooks/           # Custom React hooks (useAuth)
│   │   ├── pages/           # Pages (Dashboard, Products, Categories, StockLogs, Login, Register)
│   │   ├── services/        # Service layers (axiosInstance, auth, product, category)
│   │   ├── App.jsx          # Route configurations
│   │   └── main.jsx         # App bootstrap entry
│   └── vite.config.js       # Vite configuration
└── .gitignore               # Root git ignore rules
```

---

## Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB instance

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/shivamcse7056/inventory-managment-system.git
cd inventory-managment-system
```

---

### Step 2: Backend Configuration
1. Open a terminal in the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` variables with your credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory
   JWT_SECRET=your_jwt_access_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@dqbunskmz
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Start the backend server:
   ```bash
   npm start
   # or for hot reloading:
   npm run dev
   ```

---

### Step 3: Frontend Configuration
1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## Database Schema (MongoDB Collections)

### 1. `users`
* `name` (String, Required)
* `email` (String, Required, Unique)
* `password` (String, Required)
* `role` (String, enum: `['admin', 'user']`, default: `'user'`)

### 2. `categories`
* `name` (String, Required, Unique)
* `description` (String)

### 3. `products`
* `name` (String, Required)
* `sku` (String, Required, Unique)
* `category` (ObjectId -> `categories`)
* `description` (String)
* `quantity` (Number, Min: `0`, Default: `0`)
* `unitPrice` (Number, Min: `0`, Default: `0`)
* `supplierName` (String, Required)
* `imageUrl` (String)
* `status` (String, enum: `['In Stock', 'Low Stock', 'Out of Stock']`)

### 4. `transactions`
* `product` (ObjectId -> `products`)
* `type` (String, enum: `['Stock In', 'Stock Out', 'Adjustment']`)
* `quantityChanged` (Number, Required)
* `newQuantity` (Number, Required)
* `performedBy` (ObjectId -> `users`)
* `notes` (String)

---

## Trade-Offs & Development Assumptions
* **Role assignment on signup**: During signup, the role defaults to `"user"` to simulate a standard production workspace flow where admin accounts are created through seed scripts/database configurations.
* **Multer memory storage**: Files are streamed directly to Cloudinary from memory buffers. This avoids relying on filesystem storage on the backend host (making it ready for serverless deployment like Vercel/Render).
* **Double-token storage**: The refresh token is kept in secure HttpOnly cookies, ensuring resilience against XSS token extraction, while the access token remains in-memory, minimizing CSRF attack vectors.
