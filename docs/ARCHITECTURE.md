# Mahin AI - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LAYER                              │
├──────────────────┬──────────────────┬──────────────────────────┤
│  Web Frontend    │  Mobile App      │  Third-party Services   │
│  (React/Next.js) │  (Flutter)       │  (Analytics, Support)   │
└──────────────────┴──────────────────┴──────────────────────────┘
          ↓                   ↓                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY                                │
│  (CORS, Rate Limiting, Authentication, Load Balancing)         │
└─────────────────────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVICES                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Auth Service │  │ Chat Service │  │ User Service         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ AI Service   │  │ File Service │  │ Email Service        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
          ↓                   ↓                      ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  MongoDB Atlas   │  │  Redis Cache     │  │ External APIs    │
│  (Primary DB)    │  │  (Sessions, Hot  │  │ (OpenAI, Resend, │
│                  │  │   Data)          │  │  Cloudinary)     │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## 🔐 Authentication Flow

```
User Login
   ↓
[Validate Credentials]
   ↓
[Generate JWT Token]
   ↓
[Return Access + Refresh Token]
   ↓
Client Stores Token (localStorage)
   ↓
[All Subsequent Requests Include Token]
   ↓
[Middleware Validates Token]
   ↓
[Access Granted]
```

### JWT Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "user_id_here",
  "email": "user@example.com",
  "iat": 1642156800,
  "exp": 1642761600
}

Signature:
HS256(Header + Payload, SECRET_KEY)
```

## 💬 Chat Flow

```
User Input
   ↓
[Validate Input]
   ↓
[Create Message Record in DB]
   ↓
[Send to AI Service]
   ↓
[AI Processing]
   ↓
[Generate Response]
   ↓
[Store Response in DB]
   ↓
[Send Back to Client]
   ↓
[Update Chat History]
```

### Real-time Updates (WebSocket)

```
Client Connect (with JWT)
   ↓
[Authenticate Connection]
   ↓
[Create Socket Session]
   ↓
[Join Conversation Room]
   ↓
Listen for Events:
  - message:send
  - message:received
  - message:typing
  - message:error
```

## 🤖 AI Integration Architecture

### Pluggable AI Provider Pattern

```
┌────────────────────────────────────────┐
│        AI Service Interface            │
├────────────────────────────────────────┤
│  - generateResponse()                  │
│  - validateProvider()                  │
│  - handleError()                       │
└────────────────────────────────────────┘
        ↑                    ↑
┌───────┴─────┐    ┌────────┴───────┐
│  OpenAI     │    │  Claude/Gemini │
│  Provider   │    │  Provider      │
└─────────────┘    └────────────────┘
```

### Provider Selection

```javascript
// config/aiProvider.js
const provider = process.env.AI_MODEL_PROVIDER; // 'openai' | 'claude' | 'gemini'

const aiService = {
  'openai': new OpenAIService(),
  'claude': new ClaudeService(),
  'gemini': new GeminiService()
}[provider];

export default aiService;
```

## 💾 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  avatar: String (Cloudinary URL),
  bio: String,
  role: String ('user' | 'admin'),
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  lastLoginAt: Date,
  settings: {
    theme: String,
    notifications: Boolean,
    language: String
  }
}
```

### Conversation Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  aiProvider: String ('openai' | 'claude'),
  messageCount: Number,
  isArchived: Boolean,
  isPinned: Boolean,
  createdAt: Date,
  updatedAt: Date,
  tags: [String]
}
```

### Message Collection

```javascript
{
  _id: ObjectId,
  conversationId: ObjectId (ref: Conversation),
  userId: ObjectId (ref: User),
  userMessage: String,
  aiResponse: String,
  tokens: {
    prompt: Number,
    completion: Number,
    total: Number
  },
  processingTime: Number (ms),
  isEdited: Boolean,
  isFlagged: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Caching Strategy

### Redis Cache Layers

```
Level 1: Session Cache (1 hour)
  - User sessions
  - JWT refresh tokens

Level 2: Hot Data Cache (24 hours)
  - User profiles (frequently accessed)
  - Recent conversations metadata
  - AI response templates

Level 3: Static Content Cache (7 days)
  - FAQ responses
  - Common answers
  - System configuration
```

### Cache Invalidation

```javascript
// On user profile update
Redis.DEL(`user:${userId}:profile`);
Redis.DEL(`user:${userId}:conversations`);

// On new message
Redis.DEL(`conversation:${conversationId}:messages`);
```

## 📊 Performance Optimization

### Database Indexing

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ lastLoginAt: -1 });

// Conversation indexes
db.conversations.createIndex({ userId: 1, createdAt: -1 });
db.conversations.createIndex({ userId: 1, isPinned: -1 });

// Message indexes
db.messages.createIndex({ conversationId: 1, createdAt: -1 });
db.messages.createIndex({ userId: 1, createdAt: -1 });
```

### Query Optimization

```javascript
// Use lean() for read-only queries
const conversations = await Conversation.find({ userId })
  .select('_id title messageCount createdAt')
  .sort({ updatedAt: -1 })
  .limit(20)
  .lean(); // No Mongoose overhead

// Use aggregation pipeline for complex queries
const stats = await Message.aggregate([
  { $match: { userId: ObjectId } },
  { $group: {
      _id: null,
      totalMessages: { $sum: 1 },
      avgTokens: { $avg: '$tokens.total' }
  }}
]);
```

## 🔒 Security Layers

### Input Validation

```
User Input
   ↓
[Schema Validation - Joi/Zod]
   ↓
[Sanitization - Remove HTML/Scripts]
   ↓
[Type Checking - Ensure correct types]
   ↓
[Business Logic Validation]
```

### Password Security

```
Password Input
   ↓
[Validate Strength - min 8 chars, uppercase, number, special]
   ↓
[Hash with Bcrypt - 10 rounds]
   ↓
[Store Hash Only]
   ↓
[Compare on Login]
```

### API Security

```
Incoming Request
   ↓
[CORS Check]
   ↓
[Rate Limiting]
   ↓
[JWT Validation]
   ↓
[Role-based Authorization]
   ↓
[Input Validation]
   ↓
[Process Request]
```

## 📈 Scalability Considerations

### Horizontal Scaling

```
┌─────────────────────────────────┐
│       Load Balancer             │
│     (Nginx/AWS ELB)             │
└───────────────┬─────────────────┘
        ↓       ↓       ↓
    ┌───────┬───────┬───────┐
    │ Node1 │ Node2 │ Node3 │
    │ App   │ App   │ App   │
    └───────┴───────┴───────┘
        ↓       ↓       ↓
    ┌─────────────────────┐
    │  MongoDB Atlas      │
    │  (Replicas)         │
    └─────────────────────┘
```

### Database Sharding (Future)

```
Shard by userId % Number of Shards
  ↓
Shard 1: Users 0-333
Shard 2: Users 334-666
Shard 3: Users 667-999
```

## 📊 Concurrent User Capacity

### Current Setup (30GB RAM, 96GB Storage)

```
Nodejs Process: ~500MB
MongoDB: ~5GB (with connections)
Redis: ~2GB (cache)
Buffer: ~5GB

Available for App Logic: ~17.5GB

Per User Session: ~150KB (avg)
17.5GB / 150KB ≈ ~115,000 sessions

Per Active Connection: ~2-3MB (with WebSocket)
17.5GB / 3MB ≈ ~5,800 concurrent connections

Conservative Estimate: ~100 concurrent active users
(with comfortable overhead for spikes)
```

## 🔄 Deployment Pipeline

```
Git Push
   ↓
[GitHub Actions Trigger]
   ↓
[Run Tests]
   ↓
[Build Docker Image]
   ↓
[Push to Registry]
   ↓
[Deploy to EC2 / Vercel]
   ↓
[Health Check]
   ↓
[Monitor]
```

## 📝 Monitoring & Logging

### Log Levels

```
ERROR   - Critical issues, user-facing errors
WARN    - Potential issues, deprecated usage
INFO    - Operational events, user actions
DEBUG   - Detailed debugging information
TRACE   - Low-level execution trace
```

### Metrics to Monitor

```
- Request latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Database query time
- Cache hit/miss ratio
- Active connections
- Memory usage
- CPU usage
- AI API costs
- API rate limit consumption
```

---

**Architecture Version**: 1.0  
**Last Updated**: January 2024
