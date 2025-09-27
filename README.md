# Bookzy Backend

**Deployed API:** https://bookzy-backend.onrender.com

---

## Overview

Bookzy Backend is a Node.js, Express, TypeScript, and MongoDB REST API for a book marketplace. It supports authentication, product management, cart, wishlist, orders, addresses, payments, and more.

---

## How to Use Locally

1. Clone the repository and go to the `backend` folder.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with all required keys (see below).
4. Start the server with `npm run dev`.
5. The API will be available at `http://localhost:8000/api/*` (or your chosen port).

**Local API Example:**
```
NEXT_PUBLIC_API_URL = http://localhost:8000/api
```

---

## Folder & File Structure

### Root Files
- `index.ts` — Main server file, sets up Express, middleware, and routes.
- `package.json`, `package-lock.json` — Dependency management.
- `tsconfig.json` — TypeScript configuration.
- `.env` — Environment variables (not committed).
- `.gitignore` — Files/folders to ignore in git.

### config/
- `dbConnect.ts` — MongoDB connection logic.
- `cloudinaryConfig.ts` — Cloudinary setup and Multer middleware for image uploads.
- `emailConfig.ts` — Nodemailer setup and email sending functions.

### controllers/
- `addressController.ts` — Address creation, update, fetch for users.
- `authController.ts` — Registration, login, email verification, password reset, Google OAuth.
- `cartController.ts` — Add/remove/view cart items, cart population.
- `orderController.ts` — Create/update orders, Razorpay payment, order history.
- `productController.ts` — CRUD for products/books, image upload, payment details.
- `userController.ts` — User profile update, fetch user address.
- `wishlistController.ts` — Add/remove/view wishlist items.
- `strategy/googleStrategy.ts` — Google OAuth strategy for passport.js.

### middleware/
- `authMiddleware.ts` — JWT authentication middleware, sets `req.id` for user.

### models/
- `Address.ts` — Mongoose schema for user addresses.
- `CartItems.ts` — Cart and cart item schemas.
- `Order.ts` — Order and order item schemas.
- `Products.ts` — Product/book schema.
- `User.ts` — User schema, password hashing, verification.
- `Wishlist.ts` — Wishlist schema.

### routes/
- `addressRoutes.ts` — Endpoints for address management.
- `authRoutes.ts` — Endpoints for authentication, Google OAuth, password reset.
- `cartRoutes.ts` — Endpoints for cart management.
- `orderRoutes.ts` — Endpoints for order management and payment.
- `productRoutes.ts` — Endpoints for product CRUD and fetch.
- `userRoutes.ts` — Endpoints for user profile update.
- `wishlistRoutes.ts` — Endpoints for wishlist management.

### utils/
- `generateToken.ts` — JWT token generation.
- `responseHandler.ts` — Standardized API response formatting.

### uploads/
- Temporary storage for images before uploading to Cloudinary.

---

## Main Features

- **User Authentication:** Register, login, email verification, Google OAuth, password reset, JWT-based sessions.
- **Product Management:** Add, update, delete, and fetch books/products. Image upload via Cloudinary. Payment details (UPI/Bank).
- **Cart System:** Add/remove products to cart, view cart with populated product details.
- **Wishlist:** Add/remove products to wishlist, view wishlist with product info.
- **Order Processing:** Create/update orders, Razorpay payment integration, order history, status updates.
- **Address Management:** Add/update user addresses, fetch addresses.
- **Email Notifications:** Registration verification, password reset via Gmail (nodemailer).
- **Role-based Access:** Only authenticated users can access protected routes.
- **File Uploads:** Multer for image uploads, Cloudinary for storage.
- **Environment Config:** Uses dotenv for environment variables.

---

## API Endpoints (Examples)

- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/verify-email/:token`, `/api/auth/google`
- **Products:** `/api/products/`, `/api/products/:id`, `/api/products/seller/:sellerId`
- **Cart:** `/api/cart/add-to-cart`, `/api/cart/remove-from-cart/:productId`, `/api/cart/:userId`
- **Wishlist:** `/api/wishlist/add-to-wishlist`, `/api/wishlist/remove-from-wishlist/:productId`, `/api/wishlist/:userId`
- **Address:** `/api/user/address/create-or-update`, `/api/user/address/`
- **User:** `/api/user/profile/update/:userId`
- **Order:** `/api/order/`, `/api/order/payment-razorpay`, `/api/order/:id`

---

## Environment Variables (.env)

Example keys to set in `.env`:
```
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
```

---

## Deployment

The backend is live at:

**https://bookzy-backend.onrender.com**

Use this for production frontend integration or API testing.

---

## Contribution & Issues

Open an issue or pull request for bugs, features, or improvements.
