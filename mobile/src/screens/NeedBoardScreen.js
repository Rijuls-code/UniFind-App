import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { productsAPI } from '../services/api';

export default function NeedBoardScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      // Fetch products and do keyword matching
      const data = await productsAPI.getAll({ limit: 50 });
      const keywords = input.toLowerCase().split(' ').filter(k => k.length > 2);
      const matches = data.filter(product => {
        const text = `${product.title} ${product.description} ${product.category}`.toLowerCase();
        return keywords.some(k => text.includes(k));
      }).slice(0, 5);

      setResults({
        extracted: {
          item: keywords[0] || 'Product',
          budget: 'Flexible',
          condition: 'Any',
          features: keywords.slice(1, 3),
        },
        matches,
      });
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NeedBoard AI</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* AI Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={16} color="#8B5CF6" />
            <Text style={styles.badgeText}>AI-Powered Matching</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>What are you looking for?</Text>
          <Text style={styles.subtitle}>
            Describe what you need, and our AI will find the perfect matches
          </Text>
        </View>

        {/* Input Area */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Example: I need a laptop for coding, budget around 70k, good battery life..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          
          <TouchableOpacity
            style={[styles.searchButton, (!input.trim() || loading) && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={!input.trim() || loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.searchButtonText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#FFFFFF" />
                  <Text style={styles.searchButtonText}>Find Matches</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Analyzing your request...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && results && (
          <View style={styles.resultsContainer}>
            {/* Extracted Info */}
            <View style={styles.extractedCard}>
              <View style={styles.extractedHeader}>
                <Ionicons name="sparkles" size={20} color="#4F46E5" />
                <Text style={styles.extractedTitle}>What we understood</Text>
              </View>
              
              <View style={styles.extractedGrid}>
                <View style={styles.extractedItem}>
                  <Text style={styles.extractedLabel}>Looking for</Text>
                  <Text style={styles.extractedValue}>{results.extracted.item}</Text>
                </View>
                <View style={styles.extractedItem}>
                  <Text style={styles.extractedLabel}>Budget</Text>
                  <Text style={styles.extractedValue}>{results.extracted.budget}</Text>
                </View>
                <View style={styles.extractedItem}>
                  <Text style={styles.extractedLabel}>Condition</Text>
                  <Text style={styles.extractedValue}>{results.extracted.condition}</Text>
                </View>
                <View style={styles.extractedItem}>
                  <Text style={styles.extractedLabel}>Features</Text>
                  <View style={styles.featuresList}>
                    {results.extracted.features.map((feature, i) => (
                      <View key={i} style={styles.featureTag}>
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* Matches */}
            <View style={styles.matchesSection}>
              <View style={styles.matchesHeader}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.matchesTitle}>Top Matches for You</Text>
              </View>
              
              {results.matches.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.matchCard}
                  onPress={() => navigation.navigate('ListingDetail', { id: product.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.matchContent}>
                    <Text style={styles.matchTitle}>{product.title}</Text>
                    <Text style={styles.matchPrice}>₹{product.price.toLocaleString()}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    fontSize: 15,
    color: '#0F172A',
    minHeight: 100,
    marginBottom: 16,
    padding: 0,
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchButtonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingText: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 16,
  },
  resultsContainer: {
    paddingHorizontal: 20,
  },
  extractedCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  extractedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  extractedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  extractedGrid: {
    gap: 12,
  },
  extractedItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  extractedLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  extractedValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  featureTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  matchesSection: {
    marginBottom: 24,
  },
  matchesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  matchesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  matchContent: {
    flex: 1,
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  matchPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4F46E5',
  },
});
