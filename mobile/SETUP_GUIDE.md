# 🚀 UniFinds Mobile App - Quick Start Guide

## 📱 Native Mobile App (NOT a Website!)

This is a **professional React Native app** that looks like Cashify - native UI, gestures, and animations!

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Install Expo CLI
```bash
npm install -g expo-cli
```

### Step 2: Navigate to Mobile Folder
```bash
cd /app/mobile
```

### Step 3: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 4: Start the App
```bash
npm start
# or
expo start
```

### Step 5: Run on Your Phone
1. Download **Expo Go** app:
   - iOS: App Store
   - Android: Play Store

2. Scan the QR code:
   - iOS: Use Camera app
   - Android: Use Expo Go app

---

## 📱 What's Fully Functional

### ✅ COMPLETE SCREENS (Production-Ready)

1. **Landing Screen** 🎨
   - Beautiful hero section
   - Feature cards with icons
   - Stats showcase
   - Smooth gradient CTA

2. **Login & Signup** 🔐
   - Native keyboard handling
   - Form validation UI
   - Smooth transitions

3. **OTP Verification** 📧
   - 6-digit auto-focus inputs
   - Native one-time code support
   - Resend functionality UI

4. **Dashboard** 🏠
   - Trust score card with gradient
   - Quick action cards (4x grid)
   - Activity stats
   - Recent transactions
   - Pull-to-refresh
   - Native notification badge

5. **Buyer Screen** 🛍️
   - Search with clear button
   - Horizontal category pills
   - Product grid with cards
   - Pull-to-refresh
   - Animated header on scroll
   - Results count

6. **Listing Detail** 📦
   - Full-screen image gallery
   - Swipeable images
   - Image indicators (dots)
   - Seller trust score (prominent)
   - Condition badges
   - Chat & Make Offer buttons
   - Bottom action bar
   - Native back button

7. **Seller Screen** 💰
   - Stats cards (Active, Sold, Revenue)
   - Listing cards with actions
   - Pull-to-refresh
   - **Floating Action Button** (FAB) for posting
   - Edit/Delete/Mark Sold actions

8. **Chat Screen** 💬
   - Chat list with unread badges
   - iMessage-style bubbles
   - Product context card
   - Quick actions (Location, Offer)
   - Native keyboard behavior
   - Active/typing status
   - Send button activation

9. **Bottom Tab Navigation** 📍
   - 5 tabs: Dashboard, Buy, Sell, Chat, Profile
   - Active state indicators
   - Native icons
   - Badge for chat notifications

---

## 🎯 Native Features

### 🔥 What Makes It Feel Native

1. **Navigation**
   - Stack navigator for screens
   - Bottom tabs (like Instagram)
   - Native gestures (swipe back)

2. **Touch Interactions**
   - Large tap targets (44x44 min)
   - Active opacity feedback
   - Ripple effect (Android)

3. **Animations**
   - Smooth 60fps transitions
   - Pull-to-refresh animation
   - Floating action button
   - Header scroll animation
   - Image carousel

4. **Platform-Specific**
   - Safe area handling
   - Keyboard avoidance
   - Status bar styling
   - iOS/Android shadows

5. **Native Components**
   - FlatList (optimized scrolling)
   - RefreshControl
   - KeyboardAvoidingView
   - Platform-specific styles

---

## 🎨 Design System

**Colors:**
```javascript
Primary: #2563EB (Electric Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Background: #F8FAFC (Light Gray)
Card: #FFFFFF (White)
Text: #0F172A (Dark Slate)
```

**Spacing:**
- Small: 12px
- Medium: 16px
- Large: 20px
- XLarge: 24px

**Border Radius:**
- Small: 8px
- Medium: 12px
- Large: 16px
- XLarge: 20px
- Circle: 50%

---

## 📂 Project Structure

```
/app/mobile/
├── App.js                          # Root component
├── src/
│   ├── screens/                    # ✅ All functional
│   │   ├── LandingScreen.js       # ✅ Complete
│   │   ├── LoginScreen.js         # ✅ Complete
│   │   ├── SignupScreen.js        # ✅ Complete
│   │   ├── OTPScreen.js           # ✅ Complete
│   │   ├── DashboardScreen.js     # ✅ Complete
│   │   ├── BuyerScreen.js         # ✅ Complete
│   │   ├── ListingDetailScreen.js # ✅ Complete
│   │   ├── SellerScreen.js        # ✅ Complete
│   │   ├── ChatScreen.js          # ✅ Complete
│   │   ├── ProfileScreen.js       # 🔨 Stub
│   │   └── PostListingScreen.js   # 🔨 Stub
│   ├── components/
│   │   └── ProductCard.js         # ✅ Complete
│   ├── navigation/
│   │   └── RootNavigator.js       # ✅ Complete
│   └── data/
│       └── mockData.js            # ✅ Complete
└── package.json
```

---

## 🎮 How to Use

### Landing → Login → Dashboard Flow

1. Open app → Lands on **Landing Screen**
2. Tap "Get Started" → **Signup Screen**
3. Fill form → Tap "Create Account" → **OTP Screen**
4. Enter 6 digits → Auto-advances to **Dashboard**

### Browse Products

1. Tap **"Buy"** tab → **Buyer Screen**
2. Pull down to refresh
3. Search or select category
4. Tap product card → **Listing Detail**
5. View images (swipe)
6. Tap "Chat with Seller" → **Chat Screen**

### Seller Flow

1. Tap **"Sell"** tab → **Seller Screen**
2. See your listings
3. Tap **FAB** (+ button) → **Post Listing** (coming soon)
4. Tap actions: Edit ✏️ Delete 🗑️ Mark Sold ✅

### Chat

1. Tap **"Chat"** tab
2. See unread badge (2 chats)
3. Tap conversation → Opens chat
4. Product context shown at top
5. Type message → Send button activates

---

## 🚧 Still To Complete

Two screens need implementation (currently stubs):

1. **ProfileScreen** - User profile with trust score visualization
2. **PostListingScreen** - Multi-step form for posting items

Reference the web app versions in `/app/frontend/src/pages/` for implementation.

---

## 📦 Building for Production

### Create Standalone App

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure build:
```bash
eas build:configure
```

3. Build for iOS:
```bash
eas build --platform ios
```

4. Build for Android:
```bash
eas build --platform android
```

### Submit to Stores

**iOS (App Store):**
```bash
eas submit --platform ios
```

**Android (Play Store):**
```bash
eas submit --platform android
```

---

## 🎯 Key Differences from Website

| Website | Mobile App |
|---------|------------|
| Header navigation | Bottom tabs |
| Hover effects | Touch feedback |
| Mouse clicks | Tap gestures |
| Scroll bars | Native scrolling |
| Modals | Bottom sheets |
| Desktop layout | Mobile-first |
| Web fonts | System fonts |
| CSS animations | Native animations |

---

## 💡 Tips for Development

### Live Reload
- Save file → App auto-updates
- Shake device → Developer menu
- Press `R` in terminal → Reload

### Debugging
- Shake device → "Debug Remote JS"
- View console in browser
- React Native Debugger

### Testing on Device
- Better performance than simulator
- Test real gestures
- Camera/location features work

---

## 🐛 Troubleshooting

**App not loading?**
```bash
npm start --clear
```

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Expo Go connection issues?**
- Ensure phone and computer on same WiFi
- Try tunnel mode: `expo start --tunnel`

---

## 🌟 Next Steps

1. **Complete ProfileScreen** - Add trust score circular progress
2. **Complete PostListingScreen** - Multi-step form with image picker
3. **Add backend** - Replace mock data with API calls
4. **Add push notifications** - Expo notifications
5. **Add camera** - For posting listings
6. **Build & submit** - App Store and Play Store

---

## 📞 Need Help?

- Expo Docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Navigation: https://reactnavigation.org/

---

**Built with ❤️ using React Native + Expo**

Enjoy your professional mobile marketplace app! 🎉
