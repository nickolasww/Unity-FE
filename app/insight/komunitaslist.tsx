import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { MagnifyingGlassIcon, EllipsisHorizontalIcon } from 'react-native-heroicons/outline';

export default function KomunitasList({ navigation }) {
  const communities = [
     { id: 1, name: 'Diet & Weight Loss', image: require('../../assets/diet.png') },
    { id: 2, name: 'Nutrisi Ibu dan Anak', image: require('../../assets/mother.png') },
    { id: 3, name: 'Motivasi and Support', image: require('../../assets/motivation.png') },
    { id: 4, name: 'Semangat Fitness', image: require('../../assets/fitness.png') },
    { id: 5, name: 'Seputar Vegetarian', image: require('../../assets/vegetarian.png') },
  ];

  // Fungsi untuk menangani navigasi ke detail komunitas
  const handleNavigateToDetail = (community) => {
    if (navigation && navigation.navigate) {
      navigation.navigate('insight/komunitasdetaillist', { community });
    } else {
      console.warn('Navigation is not available');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="mx-4 my-4 bg-white rounded-full flex-row items-center px-4 py-1 border border-gray-200">
        <MagnifyingGlassIcon size={20} color="gray" />
        <TextInput
          className="flex-1 ml-2 text-gray-700"
          placeholder="Temukan komunitas lainnya..."
          placeholderTextColor="gray"
        />
      </View>

      {/* Komunitas Anda */}
      <View className="mb-4">
        <Text className="px-4 py-2 font-semibold">Komunitas Anda</Text>
        {communities.map(community => (
          <TouchableOpacity 
            key={community.id}
            className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
            onPress={() => handleNavigateToDetail(community)}
          >
            <Image source={community.image} className="w-10 h-10 rounded-full" />
            <Text className="flex-1 ml-3 font-medium">{community.name}</Text>
            <TouchableOpacity>
              <EllipsisHorizontalIcon size={20} color="gray" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ikuti dan Telusuri Komunitas */}
      <View className="mb-4">
        <Text className="px-4 py-2 font-semibold">Ikuti dan Telusuri Komunitas yang Anda Minati!</Text>
        {communities.map(community => (
          <View 
            key={community.id}
            className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
          >
            <Image source={community.image} className="w-10 h-10 rounded-full" />
            <Text className="flex-1 ml-3 font-medium">{community.name}</Text>
            <TouchableOpacity className="bg-orange-500 rounded-full px-3 py-1">
              <Text className="text-white text-xs">+ Ikuti</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Explore Button */}
      <View className="items-center my-4">
        <TouchableOpacity className="bg-orange-500 rounded-full px-6 py-3">
          <Text className="text-white font-medium">Eksplor Komunitas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}