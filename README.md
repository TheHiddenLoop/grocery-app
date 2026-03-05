# 🛒 ApnaMartX — Grocery MERN App

A full-stack grocery e-commerce platform built with the **MERN stack**. It includes a customer-facing storefront, a seller/admin inventory management panel, and a powerful Node.js REST API backend — all working together as a complete online grocery shopping solution.

---

## 🌐 Live URLs

| App | Link |
|---|---|
| 🛍️ Customer Store | [https://apnamartx.vercel.app](https://apnamartx.vercel.app) |
| 🏪 Admin / Seller Panel | [https://grocery-inventory-two.vercel.app](https://grocery-inventory-two.vercel.app) |

---

## 📁 Project Structure

```
GROCERY-MERN-APP/
│
├── backend/                  # Node.js + Express REST API
│   ├── config/               # Database connection, Cloudinary, JWT, Multer setup
│   ├── controller/           # Business logic for each resource
│   ├── middlewares/          # Auth protection for users and sellers
│   ├── models/               # MongoDB schemas (User, Product, Order, Address)
│   ├── routes/               # API route definitions
│   ├── .env                  # Environment variables (not committed)
│   ├── index.js              # Server entry point
│   └── package.json
│
├── frontend/                 # Customer-facing React app
│   └── src/
│       ├── app/              # Redux store configuration
│       ├── assets/           # Images, icons, static files
│       ├── components/       # Reusable UI components (Header, Footer, Cards, etc.)
│       ├── data/             # Static data like categories and featured products
│       ├── features/         # Redux slices and RTK Query API calls
│       │                       (auth, cart, order, product, address, payment)
│       ├── libs/             # Helper/utility functions
│       ├── pages/            # Full page components (Home, Login, Cart, Orders, etc.)
│       ├── store/            # Redux store export
│       ├── App.jsx           # Root component with routing
│       └── main.jsx          # React entry point
│
└── grocery-inventry/         # Seller/Admin dashboard (separate React app)
    └── src/
        ├── assets/           # Seller panel static assets
        ├── components/       # Dashboard layout, UI, navigation components
        ├── features/         # Seller-specific Redux slices and API calls
        ├── hooks/            # Custom React hooks
        ├── lib/              # Utility/helper functions
        ├── pages/            # Seller pages (Dashboard, Products, Orders, AddProduct)
        ├── store/            # Seller panel Redux store
        ├── App.jsx
        └── main.jsx
```

---

## ✨ Features

### 🧑‍💼 Customer Storefront
- Browse grocery products organized by category
- Search and filter products easily
- View detailed product pages
- Add/remove items from the shopping cart
- Secure user registration and login with JWT
- Save and manage multiple delivery addresses
- Place orders and pay securely via Stripe
- Track all past and current orders in one place

### 🏪 Seller / Admin Panel
- Separate secure seller login
- Add new products with images (uploaded to Cloudinary)
- View, update, and manage all product listings
- Monitor and manage incoming customer orders
- Clean dashboard with an overview of store performance

### 🔧 Backend API
- RESTful API built with Express.js
- JWT-based authentication for both users and sellers
- Image uploads handled with Multer + Cloudinary
- Stripe payment processing with webhook support
- MongoDB with Mongoose for data modeling

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, RTK Query, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| File Uploads | Multer + Cloudinary |
| Payments | Stripe |
| Deployment | Vercel |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Stripe account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/grocery-mern-app.git
cd grocery-mern-app
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. Setup Customer Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at: `http://localhost:5173`

### 4. Setup Seller / Inventory Panel

```bash
cd grocery-inventry
npm install
npm run dev
```

Runs at: `http://localhost:5174`

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Made with ❤️ by **[Your Name](https://github.com/your-username)**

⭐ If you found this project helpful, please give it a star!