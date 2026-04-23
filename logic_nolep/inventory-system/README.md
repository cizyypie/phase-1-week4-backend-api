# Inventory System Backend

REST API for managing inventory, products, categories, orders, and users. Built with Node.js, Express, Prisma ORM, and PostgreSQL.

**Base URL:** `http://localhost:3000`

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Database Models](#database-models)
* [Validation](#validation)
* [Middleware](#middleware)
* [API Endpoints](#api-endpoints)
* [Testing](#testing)

---

## Tech Stack

| Technology        | Purpose               |
| ----------------- | --------------------- |
| Node.js + Express | HTTP server & routing |
| Prisma ORM        | Database access layer |
| PostgreSQL        | Relational database   |
| JWT               | Authentication        |
| Zod               | Request validation    |
| bcryptjs          | Password hashing      |
| Winston + Morgan  | Logging               |
| Jest + Supertest  | Testing               |

## Getting Started

### Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=7
```

### Run Project

```bash
npm run dev
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma generate
```

---

## Database Models

* User
* Token
* Category
* Product
* Order
* OrderItem

Relations:

* User has many Products, Orders, Tokens
* Category has many Products
* Product has many OrderItems
* Order has many OrderItems

---

## Validation

Requests are validated using Zod through `validate()` middleware.

* Validates `body`, `params`, and `query`
* Returns `400 Bad Request` on invalid input
* Sanitized values are written back to request object

---

## Middleware

* `auth()` - Verify JWT access token
* `authorization(...roles)` - Role-based access control
* `validate(schema)` - Validate request data
* `errorConverter` - Normalize internal errors
* `errorHandler` - Send final JSON error response
* `catchAsync` - Forward async errors automatically

---

# API Endpoints

## Auth

### POST `/auth/register`

Register a new user.

### POST `/auth/login`

Login user and receive access + refresh token.

### POST `/auth/logout`

Logout current user.

---

## Users (Admin Only)

### GET `/users`

Get all users.

### POST `/users`

Create user.

### GET `/users/:userId`

Get user by ID.

### PUT `/users/:userId`

Update user.

### DELETE `/users/:userId`

Delete user.

### GET `/users/:userId/products`

Get products by user.

### GET `/users/:userId/orders`

Get orders by user.

---

## Categories

### POST `/categories`

Create category.

### GET `/categories`

Get categories with pagination.

### GET `/categories/:categoryId`

Get category by ID.

### PUT `/categories/:categoryId`

Update category.

### DELETE `/categories/:categoryId`

Delete category.

---

## Products

### POST `/products`

Create product.

### GET `/products`

Get products with pagination and optional category filter.

### GET `/products/:productId`

Get product by ID.

### PUT `/products/:productId`

Update product.

### DELETE `/products/:productId`

Delete product.

---

## Orders (Admin Only)

### POST `/orders`

Create order.

### GET `/orders`

Get all orders.

### GET `/orders/:orderId`

Get order by ID.

### PUT `/orders/:orderId`

Update order.

### DELETE `/orders/:orderId`

Delete order.

### GET `/orders/:orderId/order-items`

Get order items by order.

---

## Order Items (Admin Only)

### POST `/order-items`

Create order item.

### GET `/order-items`

Get all order items.

### GET `/order-items/:orderItemId`

Get order item by ID.

### PUT `/order-items/:orderItemId`

Update order item.

### DELETE `/order-items/:orderItemId`

Delete order item.

---

## Testing

```bash
npm test
```

## Author

Inventory System Backend Project.
