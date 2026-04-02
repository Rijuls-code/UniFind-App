# 📱 UniFinds Mobile App (React Native)

A **professional native mobile app** for the UniFinds student marketplace platform - looks and feels like Cashify, not a website!

## ✨ What Makes This App Special

This is a **truly native mobile experience** with:
- 🎯 **Native UI Patterns** - Bottom tabs, floating action buttons, native gestures
- 🔄 **Pull-to-Refresh** - Real mobile app feel
- 💬 **iMessage-style Chat** - Native message bubbles
- 🎨 **Platform-specific Design** - iOS and Android optimized
- ⚡ **Smooth Animations** - 60fps transitions
- 👆 **Touch-optimized** - Large tap targets, swipe gestures
- 🚀 **App-like Navigation** - Stack and tab navigators

##

## 🚀 Features

- **Landing Page** - Beautiful onboarding experience
- **Authentication** - Login, Signup, OTP verification
- **Dashboard** - Home screen with quick access cards
- **Buyer Flow** - Browse products, search, filters, listing details
- **Seller Flow** - Manage listings, post new items
- **Chat** - Real-time messaging interface
- **Profile** - User profile with trust score
- **Need Board** - AI-powered product matching

## 📱 Tech Stack

- **React Native** with Expo
- **React Navigation** for routing
- **Expo Vector Icons** for icons
- **Expo Linear Gradient** for gradients
- **Expo Image Picker** for image uploads

## 🎨 Design System

- **Primary Color**: #2563EB (Electric Blue)
- **Font**: Inter (System default on mobile)
- **Theme**: Light, Swiss High-Contrast
- **Mobile-First**: Touch-optimized interactions

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS/Android)

### Installation

1. Navigate to the mobile directory:
```bash
cd /app/mobile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app

## 📂 Project Structure

```
/app/mobile/
├── App.js                 # Root component
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── babel.config.js       # Babel configuration
└── src/
    ├── screens/          # All app screens
    │   ├── LandingScreen.js
    │   ├── LoginScreen.js
    │   ├── SignupScreen.js
    │   ├── OTPScreen.js
    │   ├── DashboardScreen.js
    │   ├── BuyerScreen.js
    │   ├── ListingDetailScreen.js
    │   ├── SellerScreen.js
    │   ├── PostListingScreen.js
    │   ├── ChatScreen.js
    │   └── ProfileScreen.js
    ├── components/       # Reusable components
    │   ├── ProductCard.js
    │   └── Header.js
    ├── navigation/       # Navigation setup
    │   └── RootNavigator.js
    ├── data/            # Mock data
    │   └── mockData.js
    └── utils/           # Utility functions
```

## 📱 Navigation Structure

```
Stack Navigator
├── Landing Screen
├── Login Screen
├── Signup Screen
├── OTP Screen
└── Main (Bottom Tabs)
    ├── Dashboard
    ├── Buy (Buyer Screen)
    ├── Sell (Seller Screen)
    ├── Chat
    └── Profile
```

## 🎯 Key Screens

### 1. Landing Screen
- Hero section with app tagline
- Feature cards (AI Matching, Trust Score, Condition Grading)
- Stats showcase
- CTA buttons

### 2. Authentication
- **Login**: Email/Password form
- **Signup**: Full name, Email, College, Password
- **OTP**: 6-digit verification

### 3. Dashboard
- Welcome message with trust score
- Quick access cards (Buy, Sell, Need Board, etc.)
- Quick stats (Items bought/sold, Rating)
- Recent activity feed

### 4. Buyer Screen
- Search bar
- Category filters
- Price range filters
- Product grid with cards
- Each card shows: image, title, price, condition, seller info

### 5. Listing Detail
- Full-screen image gallery
- Product details and specifications
- Seller information with trust score
- Condition breakdown
- Action buttons (Chat, Make Offer)

### 6. Seller Screen
- User's active listings
- Stats (Active listings, Sold this month, Revenue)
- Actions: Edit, Delete, Mark as Sold
- Post new listing button

### 7. Chat Screen
- Chat list (left sidebar on tablet/web)
- Message bubbles (iMessage-style)
- Product context card
- Quick actions (Share location, Send offer)

### 8. Profile Screen
- User info and avatar
- Large trust score display (circular progress)
- Stats cards (Items sold, Rating, Reviews)
- Achievement badges
- Review list

## 🔧 Development Tips

### Running on Physical Device

1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Run `npm start` or `yarn start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

### Running on iOS Simulator (Mac only)

```bash
npm run ios
```

### Running on Android Emulator

```bash
npm run android
```

### Hot Reload

The app automatically reloads when you save changes. Shake your device to open the developer menu.

## 🎨 Customization

### Colors

Edit colors in your components:
```javascript
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  background: '#F8FAFC',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
};
```

### Fonts

To add custom fonts:
1. Add font files to `assets/fonts/`
2. Load fonts in App.js using `expo-font`

## 📦 Building for Production

### iOS Build (requires Apple Developer account)

```bash
eas build --platform ios
```

### Android Build

```bash
eas build --platform android
```

### Prerequisites for Production Builds

1. Install EAS CLI: `npm install -g eas-cli`
2. Create Expo account
3. Run `eas build:configure`

## 🚢 Publishing to Stores

### App Store (iOS)

1. Complete iOS build
2. Submit to App Store Connect
3. Fill in app metadata
4. Submit for review

### Google Play Store (Android)

1. Complete Android build
2. Create Google Play Console account
3. Upload APK/AAB
4. Fill in store listing
5. Submit for review

## 🐛 Common Issues

### Metro Bundler Issues

```bash
npm start --clear
```

### iOS Simulator Not Starting

```bash
sudo xcode-select --switch /Applications/Xcode.app
```

### Android Emulator Issues

Ensure Android Studio and emulator are properly installed.

## 📱 Mock Data

The app uses mock data for demonstration:
- 6 sample products (laptops, phones, accessories)
- 3 sample users
- Pre-populated stats and reviews

Replace mock data in `/src/data/mockData.js` with real API calls for production.

## 🔗 Related

- **Web App**: Located in `/app/frontend/`
- **Backend**: Located in `/app/backend/` (if applicable)

## 📄 License

MIT

## 👥 Support

For issues or questions:
- Check Expo documentation: https://docs.expo.dev/
- React Native docs: https://reactnative.dev/

---

**Note**: This is a frontend-only demo app with mock data. For production, integrate with a real backend API and authentication system.
