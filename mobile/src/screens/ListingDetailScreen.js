// Stub screen - to be implemented
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ListingDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Listing Detail Screen</Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  text: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 8 },
});
