import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { products, users } from '../data/mockData';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const product = products.find(p => p.id === productId);
  const seller = users.find(u => u.id === product?.sellerId);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  return (
    <View style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setSelectedImage(index);
          }}
          scrollEventThrottle={16}
        >
          {product.images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.image} />
          ))}
        </ScrollView>
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        {/* Image Indicator */}
        <View style={styles.imageIndicator}>
          {product.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                selectedImage === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Condition Badge */}
        <View style={styles.conditionBadge}>
          <Text style={styles.conditionText}>{product.condition}</Text>
        </View>

        {/* Title & Price */}
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>₹{product.price.toLocaleString()}</Text>

        {/* Quick Info */}
        <View style={styles.quickInfo}>
          <View style={styles.quickInfoItem}>
            <Ionicons name="location" size={16} color="#64748B" />
            <Text style={styles.quickInfoText}>{product.location}</Text>
          </View>
          <View style={styles.quickInfoItem}>
            <Ionicons name="eye" size={16} color="#64748B" />
            <Text style={styles.quickInfoText}>{product.views} views</Text>
          </View>
        </View>

        {/* Seller Card */}
        <View style={styles.sellerCard}>
          <View style={styles.sellerHeader}>
            <Image source={{ uri: seller?.avatar }} style={styles.sellerAvatar} />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{seller?.name}</Text>
              <Text style={styles.sellerCollege}>{seller?.college}</Text>
            </View>
            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileText}>View</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.trustScoreContainer}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.trustScoreLabel}>Trust Score</Text>
            <Text style={styles.trustScore}>{seller?.trustScore}%</Text>
          </View>

          <View style={styles.sellerStats}>
            <View style={styles.sellerStat}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.sellerStatText}>{seller?.rating}</Text>
            </View>
            <View style={styles.sellerStat}>
              <Text style={styles.sellerStatText}>{seller?.reviewCount} reviews</Text>
            </View>
            <View style={styles.sellerStat}>
              <Text style={styles.sellerStatText}>Since {seller?.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Condition Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition Details</Text>
          <View style={styles.conditionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.conditionItemText}>No major scratches or dents</Text>
          </View>
          <View style={styles.conditionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.conditionItemText}>All features working perfectly</Text>
          </View>
          <View style={styles.conditionItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.conditionItemText}>Original accessories included</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <LinearGradient
            colors={['#2563EB', '#1D4ED8']}
            style={styles.chatButtonGradient}
          >
            <Ionicons name="chatbubbles" size={22} color="#FFF" />
            <Text style={styles.chatButtonText}>Chat with Seller</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.offerButton}>
          <Text style={styles.offerButtonText}>Make Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width,
    height: width * 1.1,
    position: 'relative',
  },
  image: {
    width,
    height: width * 1.1,
    backgroundColor: '#F1F5F9',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  favoriteButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  conditionBadge: {
    backgroundColor: '#10B981',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 32,
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2563EB',
    marginBottom: 16,
  },
  quickInfo: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickInfoText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  sellerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sellerCollege: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  viewProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  trustScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  trustScoreLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  trustScore: {
    fontSize: 20,
    fontWeight: '900',
    color: '#059669',
  },
  sellerStats: {
    flexDirection: 'row',
    gap: 16,
  },
  sellerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerStatText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  conditionItemText: {
    fontSize: 15,
    color: '#475569',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        paddingBottom: 34,
      },
    }),
  },
  chatButton: {
    flex: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  offerButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  offerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },
});
