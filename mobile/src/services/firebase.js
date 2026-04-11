// Firebase REST API auth for React Native (no native SDK needed)
// Uses Firebase Auth REST API with your web API key

const API_KEY = 'AIzaSyDf0S3wwoPt7oSJo5xiNuWavAwhoHt3P-8';
const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseAuth = {
  signup: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}:signUp?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const data = await res.json();
      if (data.error) return { success: false, error: data.error.message };
      await AsyncStorage.setItem('auth_token', data.idToken);
      await AsyncStorage.setItem('refresh_token', data.refreshToken);
      await AsyncStorage.setItem('user_id', data.localId);
      return { success: true, user: data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  login: async (email, password) => {
    try {
      const res = await fetch(`${BASE_URL}:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const data = await res.json();
      if (data.error) return { success: false, error: data.error.message };
      await AsyncStorage.setItem('auth_token', data.idToken);
      await AsyncStorage.setItem('refresh_token', data.refreshToken);
      await AsyncStorage.setItem('user_id', data.localId);
      return { success: true, user: data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user_id']);
    return { success: true };
  },

  getToken: async () => {
    return await AsyncStorage.getItem('auth_token');
  },

  getUserId: async () => {
    return await AsyncStorage.getItem('user_id');
  },

  isLoggedIn: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  },
};
