import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

export default function ArtikelList() {
  const articles = [
    {
      id: 1,
      image: require('../../assets/food.png'),
      title: '6 Fakta Temuan Pakar Nutrisi Soal Konsumsi Protein Berlebih',
      source: 'Tempo.com',
      date: '10-05-2025',
    },
    {
      id: 2,
      image: require('../../assets/food.png'),
      title: 'Manfaat Makan Sayuran Setiap Hari untuk Kesehatan',
      source: 'Kompas.com',
      date: '09-05-2025',
    },
    {
      id: 3,
      image: require('../../assets/food.png'),
      title: 'Pentingnya Asupan Protein dalam Diet Sehat',
      source: 'Tempo.com',
      date: '08-05-2025',
    },
    {
      id: 4,
      image: require('../../assets/food.png'),
      title: 'Cara Memilih Makanan Sehat untuk Tubuh yang Bugar',
      source: 'Detik.com',
      date: '07-05-2025',
    },
    {
      id: 5,
      image: require('../../assets/food.png'),
      title: 'Panduan Diet Protein untuk Menurunkan Berat Badan',
      source: 'Tempo.com',
      date: '06-05-2025',
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="mx-4 my-4 bg-white rounded-full flex-row items-center px-4 py-1 border border-gray-200">
        <MagnifyingGlassIcon size={20} color="gray" />
        <TextInput
          className="flex-1 ml-2 text-gray-700"
          placeholder="Temukan artikel lainnya..."
          placeholderTextColor="gray"
        />
      </View>

      {/* Articles */}
      <View className="px-4">
        {articles.map((article) => (
          <TouchableOpacity
            key={article.id}
            className="bg-white rounded-lg mb-4 overflow-hidden shadow-sm"
          >
            <View className="flex-row p-4">
              <Image
                source={article.image}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-800">{article.title}</Text>
                <Text className="text-sm text-gray-500">{article.source}</Text>
                <Text className="text-sm text-gray-400">{article.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
