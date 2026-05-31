# Mahin AI - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm 9+** or **yarn 3+** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Docker** (Optional) - [Download](https://www.docker.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Resend Account** - [Sign up](https://resend.com/)
- **OpenAI API Key** - [Get here](https://platform.openai.com/)
- **AWS EC2 Instance** (For production)
- **Vercel Account** (For frontend deployment)
- **Flutter SDK** (Optional - For mobile app)

## 🔧 Step 1: Clone Repository

```bash
git clone https://github.com/tabassumislam01/Mahin-Ai.git
cd Mahin-Ai
```

## 📝 Step 2: Configure Environment Variables

### Master Configuration (.env.example)

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```bash
# SERVER
NODE_ENV=development
PORT=5000

# MONGODB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mahin_ai
MONGODB_DB_NAME=mahin_ai

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_here
JWT_EXPIRES_IN=7d

# OPENAI
OPENAI_API_KEY=sk-your_actual_key_here
OPENAI_MODEL=gpt-3.5-turbo

# CLOUDINARY
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# RESEND
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@mahin.app

# DOMAIN
DOMAIN=mahin.app
FRONTEND_URL=http://localhost:3000
```

## 🏗️ Step 3: Setup Backend

### 3.1 Navigate to Backend

```bash
cd backend
cp ../.env.example .env
```

### 3.2 Edit Backend .env

The backend uses the main `.env` file. Update with your values.

### 3.3 Install Dependencies

```bash
npm install
```

### 3.4 Verify MongoDB Connection

```bash
# Test connection (create a simple test script)
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ MongoDB Connected')).catch(e => console.log('❌ Connection Failed:', e.message))"
```

### 3.5 Create Database Indexes (if needed)

```bash
npm run setup:db
```

### 3.6 Start Backend Development Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Server running on http://localhost:5000
✅ MongoDB connected
✅ Redis connected (if enabled)
```

### 3.7 Test Backend API

```bash
curl http://localhost:5000/api/health
```

## 💻 Step 4: Setup Frontend

### 4.1 Navigate to Frontend

```bash
cd ../frontend
cp ../.env.example .env.local
```

### 4.2 Edit Frontend .env.local

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DOMAIN=localhost
NEXT_PUBLIC_APP_NAME=Mahin AI
```

### 4.3 Install Dependencies

```bash
npm install
```

### 4.4 Start Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
✅ Local:    http://localhost:3000
```

## 📱 Step 5: Setup Mobile App (Optional)

### 5.1 Prerequisites

```bash
# Install Flutter
flu  help  # Check if Flutter is installed
# If not, download from https://flutter.dev/docs/get-started/install
```

### 5.2 Navigate to Mobile

```bash
cd ../mobile
```

### 5.3 Update Configuration

Edit `lib/config/config.dart` with your API URL:

```dart
const String apiUrl = 'http://localhost:5000';
```

### 5.4 Get Dependencies

```bash
flutter pub get
```

### 5.5 Run on Emulator/Device

```bash
# Android Emulator
flutter run

# iOS Simulator
flutter run -d iphone

# Physical Device
flutter run -d <device_id>
```

## 🐳 Alternative: Docker Setup (All Services)

### Quick Start with Docker

```bash
# From root directory
docker-compose up -d
```

This starts:
- MongoDB on `localhost:27017`
- Redis on `localhost:6379`
- Backend on `localhost:5000`
- Frontend on `localhost:3000`

### Check Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
```

### Stop Services

```bash
docker-compose down
```

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account setup
- [ ] Resend API key obtained
- [ ] OpenAI API key obtained
- [ ] `.env` file filled with all values
- [ ] `backend/.env` configured
- [ ] `frontend/.env.local` configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running (http://localhost:5000)
- [ ] Frontend server running (http://localhost:3000)
- [ ] MongoDB connection successful
- [ ] API endpoints responding

## 🚀 Running Everything

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

### Terminal 3: Mobile (Optional)

```bash
cd mobile
flutter run
```

### Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs (if Swagger enabled)
- **Mobile**: Running on emulator/device

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check connection string
echo $MONGODB_URI

# Verify network access in MongoDB Atlas
# Go to Atlas Dashboard > Network Access > Add IP Address
```

### Port Already in Use

```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### Dependencies Not Installing

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Environment Variables Not Loading

```bash
# Verify .env file exists in correct location
ls -la .env

# Check file is not corrupt
cat .env

# Restart development server after changing .env
```

## 📚 Next Steps

1. Read [API Documentation](./API.md)
2. Review [Architecture Details](./ARCHITECTURE.md)
3. Check [Contributing Guidelines](./CONTRIBUTING.md)
4. Setup production deployment

## 📞 Support

If you encounter issues:

1. Check existing issues: https://github.com/tabassumislam01/Mahin-Ai/issues
2. Email support: support@mahin.app
3. Review logs: `docker-compose logs -f`

---

**Happy Coding! 🚀**
