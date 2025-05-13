import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { HeartIcon, ChatBubbleLeftIcon, BookmarkIcon, ShareIcon, ChartBarIcon, EllipsisHorizontalIcon } from 'react-native-heroicons/outline';
import { PencilSquareIcon } from 'react-native-heroicons/solid';

export default function KomunitasDetailList({ route, navigation }) {
  // Tambahkan pengecekan untuk route dan route.params
  const community = route?.params?.community || { name: 'Komunitas' };
  
  const posts = [
    {
      id: 1,
      user: 'Novia Tanu',
      username: '@noviatanu',
      time: '1h',
      content: 'Halo teman-teman sehat! 🌿\nHari ini aku mau sharing salah satu menu favoritku selama diet: Salad Ayam Alpukat Segar 🥗🥑\nResep ini super gampang, cocok banget buat yang lagi jaga kalori tapi tetap mau makan enak!\nAda yang mau aku share kah?',
      likes: 17,
      comments: 12,
      views: '12,4k'
    },
    {
      id: 2,
      user: 'Novia Tanu',
      username: '@noviatanu',
      time: '1h',
      content: 'Halo teman-teman sehat! 🌿\nHari ini aku mau sharing salah satu menu favoritku selama diet: Salad Ayam Alpukat Segar 🥗🥑\nResep ini super gampang, cocok banget buat yang lagi jaga kalori tapi tetap mau makan enak!\nAda yang mau aku share kah?',
      likes: 17,
      comments: 12,
      views: '12,4k'
    },
    {
      id: 3,
      user: 'Novia Tanu',
      username: '@noviatanu',
      time: '1h',
      content: 'Halo teman-teman sehat! 🌿\nHari ini aku mau sharing salah satu menu favoritku selama diet: Salad Ayam Alpukat Segar 🥗🥑\nResep ini super gampang, cocok banget buat yang lagi jaga kalori tapi tetap mau makan enak!\nAda yang mau aku share kah?',
      likes: 17,
      comments: 12,
      views: '12,4k'
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        {posts.map(post => (
          <View key={post.id} className="bg-white mb-2 pb-2">
            <View className="flex-row items-center p-4">
              <Image 
                source={require('../../assets/profile.png')} 
                className="w-10 h-10 rounded-full"
              />
              <View className="flex-1 ml-3">
                <Text className="font-bold">{post.user}</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-xs">{post.username}</Text>
                  <Text className="text-gray-500 text-xs ml-2">• {post.time}</Text>
                </View>
              </View>
              <TouchableOpacity>
                <EllipsisHorizontalIcon size={20} color="gray" />
              </TouchableOpacity>
            </View>
            
            <View className="px-4 mb-2">
              <Text className="text-gray-800">{post.content}</Text>
            </View>
            
            <View className="flex-row px-4 items-center">
              <TouchableOpacity className="flex-row items-center mr-4">
                <HeartIcon size={20} color="#FF5722" />
                <Text className="ml-1 text-gray-600">{post.likes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center mr-4">
                <ChatBubbleLeftIcon size={20} color="gray" />
                <Text className="ml-1 text-gray-600">{post.comments}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center mr-4">
                <ChartBarIcon size={20} color="gray" />
                <Text className="ml-1 text-gray-600">{post.views}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="ml-auto">
                <BookmarkIcon size={20} color="gray" />
              </TouchableOpacity>
              
              <TouchableOpacity className="ml-4">
                <ShareIcon size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-orange-500 items-center justify-center shadow-lg"
        onPress={() => console.log('Create new post')}
      >
        <PencilSquareIcon size={27} color="white" />
      </TouchableOpacity>
    </View>
  );
}