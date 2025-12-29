# 🍕 LocalBites - Local Food Ordering Platform

A complete food ordering platform for small towns where major food delivery services are not available.

## 📁 Project Structure

```
local-food-delivery/
├── backend/                 # Express.js API server
│   ├── config/             # Database & environment config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API route definitions
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
│
├── frontend/               # React.js application
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── context/        # React Context (Auth, Cart)
│       ├── hooks/          # Custom hooks
│       ├── services/       # API service functions
│       ├── styles/         # CSS files
│       └── utils/          # Helper functions
│
└── README.md
```

## 🛠️ Technology Stack

- **Frontend:** React.js with React Router
- **Backend:** Node.js + Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** CSS3 (Mobile-first responsive)
- **Payment:** Cash on Delivery (Phase 1)

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ installed
- MongoDB Atlas account (free) or local MongoDB
- Git

### Step 1: Clone and Setup Backend

```bash
cd local-food-delivery/backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

### Step 2: Setup Frontend

```bash
cd local-food-delivery/frontend
npm install
npm start
```

## 📊 Database Models

### User Schema
- name, email, phone, password
- role: customer | restaurant | delivery | admin
- address, location

### Restaurant Schema
- owner (User ref), name, description
- cuisine, address, phone
- isApproved, isOpen, rating
- deliveryTime, minOrder

### FoodItem Schema
- restaurant (ref), name, description
- price, category, image
- isVeg, isAvailable

### Order Schema
- customer, restaurant (refs)
- items, totalAmount
- status: placed | confirmed | preparing | out_for_delivery | delivered | cancelled
- deliveryAddress, paymentMethod

## 🔌 API Endpoints

### Auth Routes
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Restaurant Routes
- GET `/api/restaurants` - List all approved restaurants
- GET `/api/restaurants/:id` - Get restaurant with menu
- POST `/api/restaurants` - Create restaurant (restaurant role)
- PUT `/api/restaurants/:id` - Update restaurant

### Food Item Routes
- GET `/api/foods/restaurant/:id` - Get restaurant menu
- POST `/api/foods` - Add food item
- PUT `/api/foods/:id` - Update food item
- DELETE `/api/foods/:id` - Delete food item

### Order Routes
- POST `/api/orders` - Place order
- GET `/api/orders/my-orders` - Customer's orders
- GET `/api/orders/restaurant` - Restaurant's orders
- PUT `/api/orders/:id/status` - Update order status

### Admin Routes
- GET `/api/admin/restaurants` - All restaurants
- PUT `/api/admin/restaurants/:id/approve` - Approve restaurant
- GET `/api/admin/orders` - All orders
- GET `/api/admin/stats` - Dashboard statistics

## 💰 Business Model

1. **Commission per order:** Admin sets commission % (e.g., 10%)
2. **COD Only:** Restaurants collect cash, pay commission weekly
3. **Delivery Partners:** Local delivery boys paid per delivery

## 🌐 Deployment (Free Options)

### Backend - Render.com
1. Push code to GitHub
2. Create Render account
3. New Web Service → Connect repo
4. Set environment variables
5. Deploy!

### Frontend - Vercel/Netlify
1. Push frontend to GitHub
2. Import project in Vercel
3. Set `REACT_APP_API_URL` env variable
4. Deploy!

### Database - MongoDB Atlas
1. Create free M0 cluster
2. Create database user
3. Whitelist IP (0.0.0.0/0 for all)
4. Get connection string

## 🔮 Future Upgrades

### Phase 2
- [ ] Online payments (Razorpay/PhonePe)
- [ ] Real-time order tracking
- [ ] Push notifications
- [ ] Restaurant ratings & reviews

### Phase 3
- [ ] React Native mobile app
- [ ] Delivery partner app
- [ ] SMS notifications (Twilio)
- [ ] Advanced analytics

### Phase 4
- [ ] Multiple locations support
- [ ] Promotional coupons
- [ ] Subscription plans for restaurants
- [ ] AI-based recommendations

## 👨‍💻 Author

Built for small town food delivery needs.

## 📄 License

MIT License - Feel free to use and modify!
