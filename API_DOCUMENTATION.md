# 🚀 DissertScaffold API Documentation

## **Overview**
Clean, efficient APIs built with Next.js 14, Prisma ORM, and NextAuth.js. Following 2024/2025 best practices with minimal verbosity.

---

## **🔐 Authentication APIs**

### **1. User Registration**
```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "STUDENT",
  "institutionName": "University of Example",
  "researchArea": "Computer Science",
  "academicLevel": "PHD"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "STUDENT",
    "isActive": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### **2. Email Verification**
```http
GET /api/auth/verify-email?token=verification_token
POST /api/auth/verify-email
```

**Request Body** (POST):
```json
{
  "token": "verification_token_here"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Email verified successfully! You can now sign in."
}
```

---

### **3. User Login (NextAuth.js)**
```http
POST /api/auth/[...nextauth]
```

**Features**: JWT sessions, bcrypt hashing, email verification required, 30-day duration

---

### **4. Forgot Password**
```http
POST /api/auth/forgot-password
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

---

### **5. Reset Password**
```http
POST /api/auth/reset-password
```

**Request Body**:
```json
{
  "token": "reset_token_here",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset successfully! You can now sign in with your new password."
}
```

---

## **👤 User Management APIs**

### **6. Get User Profile**
```http
GET /api/user/profile
```

**Headers**: Requires authentication (NextAuth session)

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "userType": "STUDENT",
    "institutionName": "University of Example",
    "researchArea": "Computer Science",
    "academicLevel": "PHD",
    "bio": "Researching AI ethics...",
    "expertise": ["Machine Learning", "AI Ethics"],
    "image": "/images/avatar.jpg",
    "isActive": true,
    "emailVerified": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### **7. Update User Profile**
```http
PUT /api/user/profile
```

**Headers**: Requires authentication (NextAuth session)

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "institutionName": "New University",
  "researchArea": "Artificial Intelligence",
  "academicLevel": "PHD",
  "bio": "Updated bio text...",
  "expertise": ["AI", "Machine Learning", "Ethics"]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
  }
}
```

---

### **8. Change Password**
```http
POST /api/user/change-password
```

**Headers**: Requires authentication (NextAuth session)

**Request Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### **9. Get Session Info**
```http
GET /api/auth/me
```

**Headers**: Requires authentication (NextAuth session)

**Response**:
```json
{
  "success": true,
  "user": {
    // Full user object
  },
  "session": {
    "expires": "2024-02-01T00:00:00.000Z"
  }
}
```

---

## **🛡️ Security Features**

- **JWT sessions** with NextAuth.js
- **bcrypt hashing** (12 salt rounds)
- **Email verification** required
- **Route protection** with middleware
- **Zod validation** schemas
- **SQL injection prevention** with Prisma
- **XSS protection** with input sanitization

---

## **🔧 Technical Implementation**

- **Prisma ORM** with SQLite/PostgreSQL
- **RESTful design** with consistent responses
- **Error handling** with proper HTTP status codes
- **Shared select objects** for efficiency
- **Minimal verbosity** while maintaining clarity

---

## **📱 Frontend Integration**

### **Current State**
- ✅ **Authentication APIs** - Complete & optimized
- ✅ **User Management APIs** - Complete & optimized  
- 🔄 **Timeline APIs** - Next to implement
- 🔄 **Mentor APIs** - Next to implement
- 🔄 **Evaluation APIs** - Next to implement

---

## **🚀 Next Steps**

1. **Test authentication APIs** with Postman/Thunder Client
2. **Regenerate Prisma client** after schema changes
3. **Build Timeline APIs** to replace Jotai timeline store
4. **Build Mentor APIs** to replace Jotai mentor store

---

*Last updated: January 2024*
*Version: 1.1.0 - Optimized & Concise*
