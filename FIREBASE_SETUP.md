# UniFind Firebase Setup Guide

## Overview

UniFind now uses Firebase for authentication and Firestore for the database, following the architecture from the reference repository. This provides:

- **Firebase Authentication**: Secure user authentication with email/password
- **Firestore Database**: Scalable NoSQL database for all app data
- **Real-time Updates**: Live data synchronization
- **Easy Deployment**: No need to manage database servers

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Firebase account (free tier is sufficient)
- Yarn package manager

## Part 1: Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `unifind` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

### 3. Create Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select **Start in test mode** (for development)
4. Choose a location closest to you
5. Click "Enable"

### 4. Get Web App Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app with nickname: `unifind-web`
5. Copy the `firebaseConfig` object - you'll need these values

### 5. Get Service Account Key (for Backend)

1. In Firebase Console, go to **Project Settings > Service Accounts**
2. Click "Generate new private key"
3. Click "Generate key" - a JSON file will download
4. Save this file as `firebase-credentials.json` in the `backend/` directory
5. **IMPORTANT**: Add `firebase-credentials.json` to `.gitignore`

## Part 2: Backend Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment

Create `backend/.env`:

```env
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
API_HOST=0.0.0.0
API_PORT=8000
```

### 3. Place Service Account Key

- Move the downloaded `firebase-credentials.json` to the `backend/` directory
- Verify the file path matches the `.env` configuration

### 4. Start Backend Server

```bash
# Make sure you're in the backend directory with venv activated
python main.py
```

The backend will start on `http://localhost:8000`

## Part 3: Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
yarn install

# Install Firebase SDK
yarn add firebase
```

### 2. Configure Environment

Create `frontend/.env` with your Firebase config from Step 1.4:

```env
# Backend API
REACT_APP_API_URL=http://localhost:8000

# Firebase Configuration (from Firebase Console)
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=unifind-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=unifind-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=unifind-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. Start Frontend Server

```bash
yarn start
```

The frontend will start on `http://localhost:3000`

## Part 4: Testing the Integration

### 1. Sign Up Flow

1. Open `http://localhost:3000`
2. Click "Sign Up"
3. Fill in the registration form:
   - Name: Your Name
   - Email: your.email@example.com
   - College: Your College
   - Branch: Your Branch
   - Password: (min 6 characters)
4. Click "Create Account"
5. Check your email for verification link (Firebase sends automatically)
6. You'll be logged in and redirected to dashboard

### 2. Verify in Firebase Console

1. Go to **Authentication > Users** - you should see your new user
2. Go to **Firestore Database > Data** - you should see a `users` collection with your profile

### 3. Test API Endpoints

Visit `http://localhost:8000/docs` to see the interactive API documentation (Swagger UI)

## Firestore Collections Structure

The backend creates these collections:

```
firestore/
├── users/              # User profiles
├── products/           # Product listings
├── chats/              # Chat conversations
├── messages/           # Chat messages
├── needs/              # Need Board posts
├── need_responses/     # Responses to needs
├── transactions/       # Transaction records
├── reviews/            # User reviews
└── reports/            # Reported content
```

## Security Rules (Production)

Before deploying to production, update Firestore security rules:

1. Go to **Firestore Database > Rules**
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Products are public for reading
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.seller_id;
    }
    
    // Chats are private
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.buyer_id || 
         request.auth.uid == resource.data.seller_id);
    }
    
    // Messages are private
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Needs are public
    match /needs/{needId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.user_id;
    }
    
    // Need responses are public
    match /need_responses/{responseId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Troubleshooting

### Backend Issues

**Error: "Could not find firebase-credentials.json"**
- Ensure the file is in the `backend/` directory
- Check the path in `.env` matches the file location

**Error: "Permission denied"**
- Verify Firestore is in test mode (for development)
- Check service account has proper permissions

### Frontend Issues

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Double-check all Firebase config values in `.env`
- Ensure no extra spaces or quotes

**Error: "Network request failed"**
- Verify backend is running on port 8000
- Check `REACT_APP_API_URL` in frontend `.env`

### Authentication Issues

**Email verification not working**
- Check spam folder
- Verify email/password auth is enabled in Firebase Console
- Check Firebase Console > Authentication > Templates for email settings

## API Documentation

Once backend is running:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Key Differences from MongoDB Version

1. **No OTP Flow**: Firebase handles email verification automatically
2. **Token Management**: Firebase ID tokens are used instead of JWT
3. **Real-time Capabilities**: Firestore supports real-time listeners (can be added later)
4. **No Database Server**: Firestore is fully managed by Google
5. **Automatic Scaling**: Firestore scales automatically with usage

## Next Steps

1. Update remaining pages to use Firebase auth
2. Add real-time listeners for chat messages
3. Implement image upload to Firebase Storage
4. Add push notifications with Firebase Cloud Messaging
5. Deploy to production (Vercel + Firebase)

## Production Deployment

### Backend (Render/Railway)
1. Add environment variables in hosting platform
2. Upload `firebase-credentials.json` or use environment variables
3. Deploy from GitHub

### Frontend (Vercel/Netlify)
1. Add Firebase config as environment variables
2. Deploy from GitHub
3. Update CORS origins in backend

## Support

For issues:
1. Check Firebase Console for errors
2. Review backend logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
