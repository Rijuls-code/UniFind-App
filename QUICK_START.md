# UniFind Quick Start Guide

## ✅ Firebase Configuration Complete!

Your Firebase credentials are already configured. Now let's get everything running.

## Step 1: Backend Setup

### 1.1 Download Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **unifind-07**
3. Click the gear icon ⚙️ > **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the downloaded JSON file as `firebase-credentials.json`
7. Move it to `UniFind-App/backend/` directory

### 1.2 Install Backend Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 1.3 Start Backend Server

```bash
python main.py
```

Backend will run on: `http://localhost:8000`

## Step 2: Frontend Setup

### 2.1 Dependencies Already Installed ✅

Firebase and Sonner (toast notifications) are already installed!

### 2.2 Start Frontend Server

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

## Step 3: Test the Application

### 3.1 Sign Up

1. Open `http://localhost:3000`
2. Click **Sign Up**
3. Fill in the form:
   - Name: Your Name
   - Email: your.email@example.com
   - College: Your College
   - Branch: Your Branch (optional)
   - Password: (minimum 6 characters)
4. Click **Create Account**
5. Check your email for verification link

### 3.2 Login

1. Go to Login page
2. Enter your email and password
3. Click **Login**
4. You'll be redirected to the dashboard

### 3.3 Verify in Firebase Console

1. Go to Firebase Console > **Authentication > Users**
   - You should see your new user
2. Go to **Firestore Database > Data**
   - You should see a `users` collection with your profile

## API Endpoints

Once backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## Troubleshooting

### Backend won't start

**Error: "Could not find firebase-credentials.json"**
- Make sure the file is in `backend/` directory
- Check the filename is exactly `firebase-credentials.json`

**Error: "Module not found"**
```bash
pip install --upgrade firebase-admin
pip install -r requirements.txt
```

### Frontend Issues

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Check `.env` file has correct Firebase config
- Restart the dev server after changing `.env`

**Error: "Network request failed"**
- Make sure backend is running on port 8000
- Check `VITE_API_URL` in `.env` is correct

### Authentication Issues

**Can't login after signup**
- Check Firebase Console > Authentication to see if user was created
- Try resetting password through Firebase

**Email verification not received**
- Check spam folder
- Firebase sends verification emails automatically
- You can still login without verification (for development)

## What's Working Now

✅ Firebase Authentication (Email/Password)
✅ User Signup with automatic email verification
✅ User Login
✅ Protected routes with Firebase tokens
✅ User profile display
✅ Product listing (fetches from Firestore)
✅ Logout functionality

## Next Steps

1. **Add Products**: Create product listings through the app
2. **Test Chat**: Try the messaging feature
3. **Need Board**: Post what you need and get matches
4. **Profile**: Update your profile information

## File Structure

```
UniFind-App/
├── backend/
│   ├── main.py                    # FastAPI server
│   ├── firebase_config.py         # Firebase setup
│   ├── firebase-credentials.json  # Your service account key
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── firebase.js       # Firebase client
│   │   │   └── api.js            # API client
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state
│   │   └── pages/
│   │       ├── LoginPage.js      # ✅ Updated
│   │       ├── SignupPage.js     # ✅ Updated
│   │       ├── ProfilePage.js    # ✅ Updated
│   │       └── BuyerPage.js      # ✅ Updated
│   └── .env                       # ✅ Configured
└── QUICK_START.md                 # This file
```

## Environment Variables

### Backend (.env)
```env
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend (.env) - Already Configured ✅
```env
VITE_API_URL=http://localhost:8000/api
VITE_FIREBASE_API_KEY=AIzaSyDf0S3wwoPt7oSJo5xiNuWavAwhoHt3P-8
VITE_FIREBASE_AUTH_DOMAIN=unifind-07.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=unifind-07
VITE_FIREBASE_STORAGE_BUCKET=unifind-07.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=768336970608
VITE_FIREBASE_APP_ID=1:768336970608:web:f03562cd3ed108ea9705b5
```

## Common Commands

### Backend
```bash
# Start server
python main.py

# Install new package
pip install package-name
pip freeze > requirements.txt
```

### Frontend
```bash
# Start dev server
npm start

# Install new package
npm install package-name --legacy-peer-deps

# Build for production
npm run build
```

## Support

- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Migration Details**: See `FIREBASE_MIGRATION_COMPLETE.md`
- **API Docs**: http://localhost:8000/docs

## Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can create new account
- [ ] Receive verification email
- [ ] Can login with credentials
- [ ] Profile page shows user data
- [ ] Can view products on Buyer page
- [ ] Logout works correctly

---

**Status**: Ready to Run! 🚀
**Next Action**: Download firebase-credentials.json and start the servers
