📦 E-Commerce Backend (Node.js + Express + MongoDB)

This is a fully functional backend for an e-commerce application built using Node.js, Express, MongoDB, and JWT authentication.
It supports user roles, product management, cart system, and order processing.

🚀 Features
👤 User Authentication

User registration (buyer or seller)

Secure login using JWT

Password hashing with bcrypt

Protected routes based on auth & role

🛍️ Products

Sellers can add products

Fetch all products (public)

Fetch products by seller

🛒 Cart System

Add items to cart

Auto-create cart for new users

View cart with total cost

📦 Orders

Place order (cart → order)

Clear cart after ordering

View user order history

🔒 Authorization

Middleware validates JWT

Restricts certain actions to sellers only

📂 Project Structure
server/
│
├── db.js               # MongoDB connection
├── index.js            # Main server file
├── schema.js           # Mongoose models (User, Product, Cart, Order)
├── server.js           # (Optional alternate entry point)
│
├── package.json
├── package-lock.json
├── .gitignore
└── .env                # Environment variables (NOT pushed to git)

🛠️ Tech Stack

Node.js

Express.js

MongoDB + Mongoose

bcrypt (password hashing)

jsonwebtoken (JWT auth)

dotenv (environment variables)

CORS

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone <your-repo-url>
cd server

2️⃣ Install dependencies
npm install

3️⃣ Create a .env file
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5174
PORT=3000


⚠️ Never commit your .env file.

4️⃣ Start the server
npm start


Server will run at:

http://localhost:3000

📡 API Endpoints
🔓 Public Routes
Method	Endpoint	Description
GET	/	Server test route
POST	/register	Create a new user
POST	/login	Login & get JWT token
GET	/all_products	Get all products
GET	/products?sellerId=	Products by seller
🔐 Protected Routes (JWT required)
👤 User
Method	Endpoint	Description
GET	/profile	Get logged-in user's profile
🛍️ Products (Seller Only)
Method	Endpoint	Description
POST	/add_products	Add product
🛒 Cart
Method	Endpoint	Description
POST	/add_to_cart	Add product to cart
GET	/view_cart	View cart
📦 Orders
Method	Endpoint	Description
POST	/place_order	Place order
GET	/view_orders	View user's orders
🔑 Authentication

Use header format:

Authorization: Bearer <token>

🧱 Database Models
Includes:

User

Product

Cart

Order

Each model is defined in schema.js.

📝 Notes

This backend is modular and easy to extend.

Suitable for MERN stack e-commerce applications.

Works with any frontend (React, Next.js, Vue, etc.)

🤝 Contributing

Pull requests are welcome!

📜 License

MIT License.
