import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MagnifyingGlassIcon, EllipsisHorizontalIcon, PencilSquareIcon } from 'react-native-heroicons/outline';
import { HeartIcon, ChatBubbleLeftIcon, BookmarkIcon, ShareIcon, ChartBarIcon } from 'react-native-heroicons/outline';
import KomunitasList from '../insight/komunitaslist';
import ArtikelList from '../insight/artikellist';

export default function InsightScreen() {
  const [activeTab, setActiveTab] = useState('Komunitas');
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Tabs */}
      <View className="flex-row border-b border-t border-gray-200 bg-white p-2">
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'Komunitas' ? 'border-b-2 border-orange-500' : ''}`}
          onPress={() => setActiveTab('Komunitas')}
        >
          <Text className={`font-medium ${activeTab === 'Komunitas' ? 'text-black' : 'text-gray-500'}`}>Komunitas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 items-center ${activeTab === 'Artikel' ? 'border-b-2 border-orange-500' : ''}`}
          onPress={() => setActiveTab('Artikel')}
        >
          <Text className={`font-medium ${activeTab === 'Artikel' ? 'text-black' : 'text-gray-500'}`}>Artikel</Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'Komunitas' ? (
        <KomunitasList navigation={navigation} />
      ) : (
        <ArtikelList />
      )}

      {/* Floating Action Button - only show on Komunitas feed */}
      {activeTab === 'Komunitas' && (
        <TouchableOpacity 
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-orange-500 items-center justify-center shadow-lg"
          onPress={() => console.log('Create new post')}
        >
          <PencilSquareIcon size={27} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}