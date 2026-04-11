import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { firebaseAuth } from '../services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileStr = await AsyncStorage.getItem('user_profile');
      if (profileStr) setProfile(JSON.parse(profileStr));
    } catch (e) {}
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await firebaseAuth.logout();
          navigation.replace('Landing');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Light Mode Toggle */}
        <View style={styles.topBar}>
          <View style={styles.lightModeButton}>
            <View style={styles.toggleTrack}>
              <View style={styles.toggleThumb}>
                <Ionicons name="sunny" size={14} color="#F59E0B" />
              </View>
            </View>
            <Text style={styles.lightModeText}>Light Mode</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Gradient Banner */}
          <LinearGradient
            colors={['#2F66E5', '#4F46E5', '#9333EA']}
            style={styles.banner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={16} color="#1E293B" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color="#CBD5E1" />
            </View>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{profile?.name || 'User'}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#059669" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: '#EFF6FF' }]}>
                  <Ionicons name="school" size={16} color="#2563EB" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>College</Text>
                  <Text style={styles.infoValue}>{profile?.college || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: '#F5F3FF' }]}>
                  <Ionicons name="git-branch" size={16} color="#7C3AED" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Branch</Text>
                  <Text style={styles.infoValue}>{profile?.branch || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="calendar" size={16} color="#D97706" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Member Since</Text>
                  <Text style={styles.infoValue}>{profile?.member_since ? new Date(profile.member_since).getFullYear() : 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="mail" size={16} color="#059669" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profile?.email || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust Score Card */}
        <View style={styles.trustScoreCard}>
          <View style={styles.trustHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#059669" />
            <Text style={styles.trustTitle}>Trust Score</Text>
          </View>
          
          <View style={styles.trustScoreCircle}>
            <Text style={styles.trustScoreValue}>{profile?.trust_score || 0}%</Text>
          </View>
          
          <Text style={styles.trustSubtitle}>Trusted campus member</Text>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="shield-checkmark" size={32} color="#2563EB" />
              </View>
              <Text style={styles.achievementLabel}>Verified</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="ribbon" size={32} color="#059669" />
              </View>
              <Text style={styles.achievementLabel}>Trusted Seller</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="star" size={32} color="#F59E0B" />
              </View>
              <Text style={styles.achievementLabel}>Top Rated</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="ribbon" size={32} color="#7C3AED" />
              </View>
              <Text style={styles.achievementLabel}>Pro Seller</Text>
            </View>
          </View>
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          <Text style={{ color: '#64748B', fontSize: 14 }}>No reviews yet.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  lightModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  lightModeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  banner: {
    height: 160,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'flex-end',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  avatarContainer: {
    position: 'absolute',
    top: 96,
    left: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  profileInfo: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  infoGrid: {
    gap: 12,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  trustScoreCard: {
    marginHorizontal: 20,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  trustTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#065F46',
  },
  trustScoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 8,
    borderColor: '#10B981',
  },
  trustScoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#059669',
  },
  trustSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  achievementLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
