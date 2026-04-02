import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  const features = [
    {
      icon: 'sparkles',
      title: 'AI Matching',
      description: 'Describe what you need, our AI finds the perfect match instantly.',
      color: '#2563EB',
    },
    {
      icon: 'shield-checkmark',
      title: 'Trust Score',
      description: 'Every user has a verified trust score based on transactions and reviews.',
      color: '#10B981',
    },
    {
      icon: 'ribbon',
      title: 'Condition Grading',
      description: 'Standardized product condition ratings ensure transparency.',
      color: '#F59E0B',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>UniFinds</Text>
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
            Buy & Sell on Campus{' '}
            <Text style={styles.heroTitleAccent}>Safely & Easily</Text>
          </Text>
          <Text style={styles.heroDescription}>
            Join India's most trusted student marketplace. Buy, sell, and trade with verified college students.
          </Text>
          
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={styles.secondaryButtonText}>Browse Listings</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.sectionTitle}>Why Choose UniFinds?</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                <Ionicons name={feature.icon} size={28} color={feature.color} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#2563EB" />
            <Text style={styles.statNumber}>8,934</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cube" size={32} color="#2563EB" />
            <Text style={styles.statNumber}>1,247</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={32} color="#2563EB" />
            <Text style={styles.statNumber}>3,421</Text>
            <Text style={styles.statLabel}>Deals</Text>
          </View>
        </View>

        {/* CTA */}
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={styles.ctaSection}
        >
          <Text style={styles.ctaTitle}>Ready to Start Trading?</Text>
          <Text style={styles.ctaDescription}>
            Join thousands of students buying and selling on campus
          </Text>
          <TouchableOpacity
            style={styles.ctaWhiteButton}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.ctaWhiteButtonText}>Create Free Account</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
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
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2563EB',
  },
  loginButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  hero: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 2,
    marginBottom: 16,
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
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  features: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 24,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  ctaSection: {
    marginHorizontal: 20,
    marginVertical: 32,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 16,
    color: '#DBEAFE',
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaWhiteButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  ctaWhiteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
});
