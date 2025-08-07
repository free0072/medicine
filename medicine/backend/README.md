# Pharma Ecommerce Backend API

A comprehensive TypeScript backend API for a pharmaceutical ecommerce platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: Complete CRUD operations for pharmaceutical products
- **Category Management**: Hierarchical category system for organizing products
- **Shopping Cart**: Full cart functionality with stock validation
- **Order Management**: Complete order lifecycle with prescription handling
- **Review System**: Product reviews and ratings with verification
- **Admin Panel**: Comprehensive admin dashboard for managing the platform
- **Sales Analytics**: Detailed sales reports and analytics
- **Prescription Management**: Prescription upload and approval system

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pharma_ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:slug` - Get single product
- `GET /api/products/featured/featured` - Get featured products
- `GET /api/products/sale/on-sale` - Get products on sale
- `GET /api/products/search/search` - Search products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item quantity
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/user/reviews` - Get user's reviews

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Admin Routes (Admin Only)
- `GET /api/admin/dashboard` - Admin dashboard statistics
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders (admin)
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/prescription` - Approve/reject prescription
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/categories` - Get all categories (admin)
- `POST /api/admin/categories` - Create category
- `GET /api/admin/reviews` - Get all reviews (admin)
- `PUT /api/admin/reviews/:id/verify` - Verify review

## Data Models

### User
- Basic info (name, email, password)
- Address and contact details
- Medical information (conditions, allergies, prescriptions)
- Role-based access (user/admin)

### Product
- Product details (name, description, brand)
- Pricing (price, compare price, cost price)
- Inventory (stock quantity, low stock threshold)
- Medical information (active ingredient, strength, dosage form)
- Prescription requirements
- Product status (active, featured, on sale)

### Category
- Hierarchical structure (parent/child relationships)
- SEO-friendly slugs
- Sort order and status

### Order
- Order items with quantities and prices
- Shipping and billing addresses
- Payment information
- Order status tracking
- Prescription handling

### Cart
- User's shopping cart items
- Quantity and pricing
- Automatic total calculation

### Review
- Product ratings and comments
- User verification
- Admin approval system

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Input validation and sanitization
- CORS configuration
- Rate limiting (can be added)

## Error Handling

- Centralized error handling middleware
- Consistent error response format
- Detailed error logging
- Validation error handling

## Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run watch` - Watch for changes and rebuild
- `npm start` - Start production server

### Code Structure
```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── server.ts        # Main server file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration time | 30d |
| EMAIL_HOST | SMTP host | - |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | SMTP username | - |
| EMAIL_PASS | SMTP password | - |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License. 