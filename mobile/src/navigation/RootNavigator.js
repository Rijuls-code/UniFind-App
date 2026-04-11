import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import OTPScreen from '../screens/OTPScreen';
import DashboardScreen from '../screens/DashboardScreen';
import BuyerScreen from '../screens/BuyerScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import SellerScreen from '../screens/SellerScreen';
import PostListingScreen from '../screens/PostListingScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NeedBoardScreen from '../screens/NeedBoardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Buy') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Sell') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Chat') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Buy" component={BuyerScreen} />
      <Tab.Screen name="Sell" component={SellerScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <Stack.Screen name="PostListing" component={PostListingScreen} />
      <Stack.Screen name="NeedBoard" component={NeedBoardScreen} />
    </Stack.Navigator>
  );
}
