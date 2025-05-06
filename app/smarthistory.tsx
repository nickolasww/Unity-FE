import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Icons
const BackIcon = () => (
  <Text style={{ fontSize: 24, color: '#8B2323' }}>←</Text>
);

const SmartHistory = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planner</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Trip Card */}
        <View style={styles.cardContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=2069&auto=format&fit=crop' }}
            style={styles.cardBackground}
          />
          <View style={styles.cardContent}>
            <Text style={styles.tripName}>Jogja Trip</Text>
            <Text style={styles.tripDate}>Sept 19 - Sept 20, 2025</Text>
            
            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>Family</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Generate Button */}
        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate New Plan</Text>
        </TouchableOpacity>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8B2323',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 20,
  },
  cardBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  tripDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B2323',
  },
  tagText: {
    fontSize: 12,
    color: '#8B2323',
  },
  generateButton: {
    backgroundColor: '#8B2323',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#8B2323',
  },
});

export default SmartHistory;