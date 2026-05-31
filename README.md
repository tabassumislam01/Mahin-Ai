# Mahin AI - Advanced AI Chatbot Platform

> An intelligent chatbot platform supporting general knowledge, educational questions, coding assistance, and daily topics.

## 📋 Project Overview

**Mahin AI** is a full-stack AI-powered chatbot platform designed for seamless conversations across multiple domains. The platform handles general knowledge queries, educational discussions, coding assistance, and everyday topics with professional, modern, and responsive design.

### 🎯 Key Features

- **AI-Powered Conversations**: Intelligent responses using advanced AI models
- **Multi-Domain Support**: General knowledge, education, coding, and daily topics
- **Real-time Chat**: WebSocket-based live messaging
- **User Authentication**: Secure JWT-based authentication
- **File Management**: Cloud-based file storage with Cloudinary
- **Email Notifications**: Automated emails via Resend API
- **Scalable Architecture**: Supports ~100 concurrent users
- **Professional UI**: Modern, responsive design with smooth animations
- **Cross-Platform**: Web (React/Next.js) and Mobile (Flutter)

## 🏗️ Architecture

### Tech Stack

#### Backend
- **Runtime**: Node.js (Express.js)
- **Database**: MongoDB Atlas
- **Hosting**: Amazon EC2 (30GB RAM, 96GB Storage)
- **Cache**: Redis (optional)
- **Specifications**: Handles ~100 concurrent users

#### Frontend
- **Framework**: React 18 / Next.js
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **State Management**: Zustand / Redux
- **Real-time**: WebSocket / Socket.io

#### Mobile
- **Framework**: Flutter
- **Target**: iOS & Android
- **State Management**: Provider / Riverpod

#### External Services
- **AI Model**: OpenAI GPT (pluggable architecture)
- **File Storage**: Cloudinary
- **Email Service**: Resend
- **Monitoring**: Sentry (optional)

## 📁 Project Structure

```
Mahin-Ai/
├── backend/              # Node.js Express server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # MongoDB schemas
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Custom middleware
│   │   ├── services/    # Business logic
│   │   ├── utils/       # Utility functions
│   │   └── app.js       # Express app setup
│   ├── .env.example     # Environment variables
│   ├── package.json     # Dependencies
│   └── server.js        # Server entry point
│
├── frontend/             # React/Next.js web app
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   ├── styles/      # Global styles
│   │   └── utils/       # Utility functions
│   ├── .env.example     # Environment variables
│   └── package.json     # Dependencies
│
├── mobile/              # Flutter mobile app
│   ├── lib/
│   │   ├── models/      # Data models
│   │   ├── screens/     # UI screens
│   │   ├── widgets/     # Reusable widgets
│   │   ├── services/    # API services
│   │   └── main.dart    # App entry point
│   ├── pubspec.yaml     # Flutter dependencies
│   └── README.md        # Mobile app setup
│
├── docs/                # Documentation
│   ├── API.md          # API documentation
│   ├── SETUP.md        # Setup instructions
│   └── ARCHITECTURE.md # Architecture details
│
├── .env.example        # Master environment template
├── .gitignore          # Git ignore rules
├── docker-compose.yml  # Docker compose configuration
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (Backend)
- Python 3.8+ (Optional tools)
- Flutter 3.0+ (Mobile development)
- MongoDB Atlas account
- Cloudinary account
- Resend API key
- OpenAI API key

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/tabassumislam01/Mahin-Ai.git
   cd Mahin-Ai
   ```

2. **Setup Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your actual values
   npm install
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your actual values
   npm install
   npm run dev
   ```

4. **Setup Mobile (Optional)**
   ```bash
   cd ../mobile
   flutter pub get
   flutter run
   ```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Rate limiting
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection
- ✅ CSRF tokens
- ✅ Secure HTTP headers
- ✅ API validation & sanitization
- ✅ Environment variable encryption
- ✅ Secure database communication (MongoDB Atlas)

## 📊 Performance & Scalability

- **Concurrent Users**: ~100 simultaneous connections
- **Message Throughput**: 1000+ messages/minute
- **Response Time**: <500ms average
- **Database Optimization**: Indexed queries, connection pooling
- **Caching Strategy**: Redis for frequently accessed data
- **Load Balancing**: Nginx reverse proxy (optional)
- **Monitoring**: Sentry error tracking

## 📝 Environment Variables

See `.env.example` for complete configuration template.

### Core Variables
```
NODE_ENV          # development | production
PORT              # Server port (default: 5000)
MONGODB_URI       # MongoDB Atlas connection string
JWT_SECRET        # JWT signing secret
OPENAI_API_KEY    # OpenAI API key
CLOUDINARY_*      # Cloudinary credentials
RESEND_API_KEY    # Resend email service key
```

## 🔗 API Endpoints

API documentation available in `docs/API.md`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/:id` - Delete chat session

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `DELETE /api/user/account` - Delete account

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:coverage

# Frontend tests
cd ../frontend
npm run test
npm run test:coverage
```

## 📦 Deployment

### Backend (EC2)
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Clone and setup
git clone https://github.com/tabassumislam01/Mahin-Ai.git
cd Mahin-Ai/backend

# Configure environment
cp .env.example .env
# Edit .env with production values

# Install and run
npm install
npm run build
npm start
```

### Frontend (Vercel)
```bash
# Push to GitHub
git push origin main

# Connect Vercel to GitHub
# Vercel will auto-deploy on push
```

### Mobile (Firebase/TestFlight)
```bash
# Build APK (Android)
flutter build apk --release

# Build IPA (iOS)
flutter build ios --release
```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [Architecture Details](docs/ARCHITECTURE.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please follow our [Contributing Guidelines](docs/CONTRIBUTING.md).

## 📄 License

Copyright © Mahin AI Developed by Mahin LTD | Developer by Tanvir

## 📞 Support

For issues, questions, or suggestions:
- Email: support@mahin.app
- Issues: GitHub Issues
- Documentation: `/docs` directory

---

**Made with ❤️ by Tanvir**
