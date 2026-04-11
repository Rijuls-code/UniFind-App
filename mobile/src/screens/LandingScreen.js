import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logo}>UniFind</Text>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.overline}>COLLEGE MARKETPLACE PLATFORM</Text>
        <Text style={styles.heroTitle}>
          Buy & Sell on Campus{'\n'}
          <Text style={styles.heroTitleAccent}>Safely & Easily</Text>
        </Text>
        <Text style={styles.heroDescription}>
          Join India's most trusted student marketplace.{'\n'}Buy, sell, and trade with verified college students.
        </Text>

        {/* Large Logo */}
        <View style={styles.heroLogoContainer}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Browse Listings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  logo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4F46E5',
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  hero: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  heroTitleAccent: {
    color: '#2563EB',
  },
  heroDescription: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  heroLogoContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  heroLogo: {
    width: 100,
    height: 100,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 14,
    width: '100%',
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1 ,
    borderColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
  },
});
