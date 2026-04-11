import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth, auth, onAuthStateChanged } from '../services/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user profile from backend
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await firebaseAuth.login(email, password);
      
      if (result.success) {
        // Fetch user profile from backend
        const response = await authAPI.getProfile();
        setUser(response.data);
        return { success: true };
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Login failed' 
      };
    }
  };

  const signup = async (data) => {
    try {
      // Create Firebase user
      const firebaseResult = await firebaseAuth.signup(data.email, data.password);
      
      if (!firebaseResult.success) {
        return firebaseResult;
      }

      // Create user profile in backend
      const response = await authAPI.signup({
        email: data.email,
        password: data.password,
        name: data.name,
        college: data.college,
        branch: data.branch || ''
      });
      
      // Send email verification
      await firebaseAuth.sendVerification();
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    await firebaseAuth.logout();
    setUser(null);
    setFirebaseUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const sendEmailVerification = async () => {
    return await firebaseAuth.sendVerification();
  };

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    signup,
    logout,
    updateUser,
    sendEmailVerification,
    isAuthenticated: !!firebaseUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
