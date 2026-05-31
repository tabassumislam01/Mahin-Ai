# Mahin AI - API Documentation

## 📖 Overview

The Mahin AI API provides endpoints for authentication, chat management, user profiles, and AI interactions.

**Base URL**: `http://localhost:5000/api` (development)  
**Base URL**: `https://api.mahin.app` (production)

## 🔐 Authentication

All protected endpoints require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## 📋 Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_id_here",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_id_here",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token_here"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Chat

#### Send Message

```http
POST /api/chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "What is machine learning?",
  "conversationId": "conv_id_here" (optional, creates new if not provided)
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "message_id_here",
    "conversationId": "conv_id_here",
    "userMessage": "What is machine learning?",
    "aiResponse": "Machine learning is a subset of artificial intelligence...",
    "timestamp": "2024-01-15T10:30:00Z",
    "processingTime": 1200
  }
}
```

#### Get Chat History

```http
GET /api/chat/history?conversationId=conv_id_here&limit=50&offset=0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_id_here",
    "messages": [
      {
        "id": "msg_1",
        "userMessage": "Hello",
        "aiResponse": "Hi! How can I help you?",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ],
    "totalMessages": 15,
    "hasMore": true
  }
}
```

#### Get All Conversations

```http
GET /api/chat/conversations?limit=20&offset=0
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_1",
        "title": "Machine Learning Discussion",
        "lastMessage": "Great question!",
        "messageCount": 15,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T11:00:00Z"
      }
    ],
    "totalConversations": 25,
    "hasMore": true
  }
}
```

#### Delete Conversation

```http
DELETE /api/chat/:conversationId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

### User Profile

#### Get User Profile

```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_id_here",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://cloudinary.com/avatar.jpg",
    "bio": "AI enthusiast",
    "conversationCount": 25,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### Update User Profile

```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "bio": "Updated bio",
  "avatar": "https://cloudinary.com/new_avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updated profile... }
}
```

#### Delete Account

```http
DELETE /api/user/account
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

## 🔄 WebSocket Events (Real-time Chat)

### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### Send Message

```javascript
socket.emit('message:send', {
  conversationId: 'conv_id',
  message: 'Hello!'
});
```

#### Receive Message

```javascript
socket.on('message:received', (data) => {
  console.log('AI Response:', data.aiResponse);
});
```

#### Typing Indicator

```javascript
socket.emit('message:typing', {
  conversationId: 'conv_id',
  isTyping: true
});

socket.on('message:typing', (data) => {
  console.log('User is typing:', data.isTyping);
});
```

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "status": 400
}
```

### Common Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

## 🔄 Rate Limiting

API rate limits:
- **General**: 100 requests per 15 minutes
- **Chat**: 50 requests per minute
- **Auth**: 5 requests per minute

Headers included in response:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642156800
```

## 📊 Request Examples

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!","name":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Pass123!"}'

# Send Message
curl -X POST http://localhost:5000/api/chat/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello AI!"}'
```

### Using JavaScript (Fetch)

```javascript
// Register
const registerRes = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'Pass123!',
    name: 'John'
  })
});

const { data } = await registerRes.json();
const token = data.token;

// Send Chat Message
const chatRes = await fetch('http://localhost:5000/api/chat/message', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: 'Hello!' })
});

const chat = await chatRes.json();
console.log(chat.data.aiResponse);
```

## 🔗 Pagination

Endpoints supporting pagination use query parameters:

```
?limit=20&offset=0&sort=-createdAt
```

- `limit` - Results per page (default: 20, max: 100)
- `offset` - Number of results to skip (default: 0)
- `sort` - Sort field (prefix with `-` for descending)

## 📝 Versioning

API endpoints are versioned via URL path: `/api/v1/...` (future versions)

Current version: `v1` (implicit in URLs)

---

**API Version**: 1.0.0  
**Last Updated**: January 2024
