import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProductCard({ product, onPress }) {
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Like New': return '#10B981';
      case 'Excellent': return '#059669';
      case 'Good': return '#F59E0B';
      case 'Fair': return '#F97316';
      default: return '#64748B';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images?.[0] }} style={styles.image} />
        <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(product.condition) }]}>
          <Text style={styles.conditionText}>{product.condition}</Text>
        </View>
        <View style={styles.viewsBadge}>
          <Ionicons name="eye-outline" size={12} color="#FFF" />
          <Text style={styles.viewsText}>{product.views}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.price}>₹{product.price?.toLocaleString()}</Text>
        
        <View style={styles.location}>
          <Ionicons name="location-outline" size={14} color="#64748B" />
          <Text style={styles.locationText}>{product.location}</Text>
        </View>
        
        <View style={styles.seller}>
          <View style={styles.sellerAvatarPlaceholder}>
            <Ionicons name="person" size={16} color="#94A3B8" />
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName} numberOfLines={1}>{product.seller_name || 'Seller'}</Text>
            <Text style={styles.sellerCollege} numberOfLines={1}>{product.seller_college || ''}</Text>
          </View>
          <View style={styles.trustBadge}>
            <Text style={styles.trustText}>{product.seller_trust_score || 0}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  conditionBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  viewsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: '#2563EB',
    marginBottom: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  sellerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  sellerCollege: {
    fontSize: 10,
    color: '#64748B',
  },
  trustBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
});
