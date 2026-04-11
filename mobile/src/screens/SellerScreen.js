import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { productsAPI } from '../services/api';
import { firebaseAuth } from '../services/firebase';

export default function SellerScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [myListings, setMyListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const userId = await firebaseAuth.getUserId();
      if (!userId) return;
      const data = await productsAPI.getUserProducts(userId);
      setMyListings(data);
    } catch (e) {
      console.error('Failed to fetch listings:', e);
    }
  };

  const handleDelete = async (productId) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await productsAPI.delete(productId);
            fetchListings();
          } catch (e) {
            Alert.alert('Error', 'Failed to delete listing');
          }
        },
      },
    ]);
  };

  const handleMarkSold = async (productId) => {
    try {
      await productsAPI.update(productId, { status: 'sold' });
      fetchListings();
    } catch (e) {
      Alert.alert('Error', 'Failed to update listing');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const activeCount = myListings.filter(l => l.status === 'active').length;
  const soldCount = myListings.filter(l => l.status === 'sold').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={myListings}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />
        }
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>My Listings</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="filter" size={20} color="#0F172A" />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{activeCount}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{soldCount}</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{myListings.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.listingCard}>
            <Image source={{ uri: item.images?.[0] }} style={styles.listingImage} />
            <View style={styles.listingContent}>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.listingPrice}>₹{item.price?.toLocaleString()}</Text>
              <View style={styles.listingMeta}>
                <View style={styles.conditionBadge}>
                  <Text style={styles.conditionText}>{item.condition}</Text>
                </View>
                <View style={styles.viewsContainer}>
                  <Ionicons name="eye-outline" size={14} color="#64748B" />
                  <Text style={styles.viewsText}>{item.views}</Text>
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="create-outline" size={20} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PostListing')}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#2563EB', '#1D4ED8']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  listingImage: {
    width: 100,
    height: 100,
    backgroundColor: '#F1F5F9',
  },
  listingContent: {
    flex: 1,
    padding: 12,
  },
  listingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2563EB',
    marginBottom: 8,
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  conditionBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conditionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  actions: {
    justifyContent: 'center',
    paddingRight: 12,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    borderRadius: 28,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
