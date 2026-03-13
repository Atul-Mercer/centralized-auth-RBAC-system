# Centralized Authentication & RBAC System

A robust, production-ready microservice architecture for centralized authentication and role-based access control (RBAC) using Node.js, Express, and MongoDB.

---

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Auth & RBAC Flow](#auth--rbac-flow)
- [API Endpoints](#api-endpoints)
  - [Auth Service](#auth-service)
  - [Resource Service](#resource-service)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Security Decisions](#security-decisions)
- [Technologies Used](#technologies-used)
- [Future Improvements](#future-improvements)

---

## Architecture Overview

```
Client (Postman / Frontend)
    ↓
Auth Service (JWT + RBAC)
    ↓
Access Token
    ↓
Resource Service (Orders API)
    ↓
Permission Middleware
    ↓
Protected Routes
```

- **Auth Service**: Manages users, roles, and permissions.
- **Resource Service**: Verifies JWT tokens and user permissions for protected APIs.

---

## Auth & RBAC Flow

### 1. Login
- **Endpoint:** `POST /auth/login`
- **Process:**
  - User sends login request with email and password.
  - Server verifies credentials.
  - If valid, generates `accessToken` and `refreshToken`.

### 2. Access Protected API
- **Endpoint:** `GET /orders`
- **Header:**
  ```
  Authorization: Bearer ACCESS_TOKEN
  ```

### 3. Token Verification
- Resource service middleware verifies:
  - JWT signature
  - Token expiration

### 4. Permission Check
- Middleware checks if user has required permission (e.g., `orders:read`).
- If permission exists, API access is allowed. Otherwise, returns **403 Forbidden**.

---

## API Endpoints

### Auth Service

#### Login
- **POST** `/auth/login`
- **Response:**
  ```json
  {
    "accessToken": "...",
    "refreshToken": "..."
  }
  ```

#### Refresh Token
- **POST** `/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "token"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "new_token"
  }
  ```

#### Logout
- **POST** `/auth/logout`
- **Response:**
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

---

### Resource Service

#### Get Orders
- **GET** `/orders`
- **Permission required:** `orders:read`

#### Create Order
- **POST** `/orders`
- **Permission required:** `orders:write`

#### Delete Order
- **DELETE** `/orders/:id`
- **Permission required:** `orders:delete`

---

## Setup Instructions

1. **Clone the repository**
   ```sh
   git clone https://github.com/Atul-Mercer/centralized-auth-RBAC-system.git
   ```

2. **Install dependencies**
   - Auth Service:
     ```sh
     cd auth-service
     npm install
     ```
   - Resource Service:
     ```sh
     cd resource-service
     npm install
     ```

3. **Run services**
   - Auth Service:
     ```sh
     npm run dev
     ```
   - Resource Service:
     ```sh
     npm run dev
     ```

---

## Environment Variables

Create `.env` files in each service using the provided `.env.example` files.

### `auth-service/.env`
```
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### `resource-service/.env`
```
PORT=3000
JWT_SECRET=your_secret_key
```

---

## Security Decisions

- Passwords hashed using **bcrypt**
- JWT for stateless authentication
- Access tokens expire in **15 minutes**
- Role-Based Access Control (RBAC)
- Permission-based middleware for API protection
- Refresh token for session renewal

---

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

## Future Improvements

- Refresh token blacklist
- Redis session store
- API Gateway
- Rate limiting
- Audit logging