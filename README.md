# 🏠 Property Management API

A scalable backend system for managing property listings, built with Node.js, TypeScript, and MongoDB. This API supports authentication, property creation with image uploads, and secure data handling.

---

## 🚀 Features

* 🔐 User Authentication (Register, Login, Logout)
* 📧 Email Verification & Password Reset
* 🏡 Property Management (Create, Delete, etc.)
* 🖼️ Image Upload with Storage Service Integration
* ✅ Request Validation using Joi
* ⚠️ Centralized Error Handling
* 📊 Structured Logging System

---

## 🧠 Architecture

This project follows a clean, layered architecture:

* **Controllers** → Handle HTTP requests/responses
* **Services** → Business logic
* **Models** → Database schemas (Mongoose)
* **Middlewares** → Auth, validation, error handling
* **Utils/Services** → Storage, logging, etc.

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB + Mongoose
* Joi (Validation)
* JWT (Authentication)

---

## 📦 Installation

```bash
git clone https://github.com/manlikeAnthony/property_management_system.git
cd property_management_api
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
JWT_LIFETIME=1d

# Storage (e.g. Cloudinary or S3)
STORAGE_API_KEY=your_key
STORAGE_SECRET=your_secret
```

---

## ▶️ Running the App

```bash
npm run dev
```

---

## 📡 API Usage

### 🔐 Auth Endpoints

#### Register

* **POST** `/api/v1/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

---

### 🏡 Property Endpoints

#### Create Property

* **POST** `/api/v1/properties`
* **Content-Type:** `multipart/form-data`

**Fields:**

* title (text)
* price (text)
* type (RENT | SALE)
* address (JSON string)
* images (files)

---

## 🖼️ Image Upload Flow

1. Client uploads image files via form-data
2. Backend validates files (type, size)
3. Files are uploaded using a storage service
4. Storage returns:

   * `url` → public access URL
   * `key` → internal identifier
5. These are stored in the database

---

## 🧪 Testing

```bash
npm test
```

---

## ⚠️ Error Handling

* Centralized error handling system
* Custom error classes with structured responses
* Proper HTTP status codes

---

## 📌 Future Improvements

* Pagination & filtering
* Role-based access control
* Caching (Redis)
* Rate limiting
* Microservices architecture

---

## 👤 Author

**Anthony Onyejesi**

---

## 📄 License

This project is licensed under the MIT License.
