import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth } from '../services/firebase';
import { authAPI } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.college || !formData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      // Create Firebase user
      const firebaseResult = await firebaseAuth.signup(formData.email, formData.password);
      if (!firebaseResult.success) {
        Alert.alert('Signup Failed', firebaseResult.error);
        return;
      }
      // Create backend profile
      try {
        await authAPI.signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          college: formData.college,
          branch: '',
        });
      } catch (e) {
        // Backend profile creation failed, but Firebase user exists
        console.warn('Backend signup failed:', e.message);
      }
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#0F172A" />
            </TouchableOpacity>

            {/* Logo */}
            <Text style={styles.logo}>UniFinds</Text>

            {/* Title */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the student marketplace community</Text>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Arjun Sharma"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>College Email</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="your.email@college.edu"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>College/University</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="school-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.college}
                    onChangeText={(text) => setFormData({ ...formData, college: text })}
                    placeholder="IIT Delhi"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signupButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2563EB',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#0F172A',
  },
  signupButton: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});
