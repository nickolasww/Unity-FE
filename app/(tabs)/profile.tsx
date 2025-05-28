import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ArrowRightOnRectangleIcon
} from 'react-native-heroicons/outline';

export default function Profile() {
  const [userData, setUserData] = useState({
    name: 'Rizka Oktavia',
    username: '@rizka.oktavia',
    profileImage: null
  });

  useEffect(() => {
    // Mengambil data user dari AsyncStorage saat komponen dimuat
    const getUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData({
            name: parsedUserData.name || 'Rizka Oktavia',
            username: parsedUserData.username || '@rizka.oktavia',
            profileImage: parsedUserData.profileImage || null
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    getUserData();
  }, []);


  return (
    <View className="flex-1 bg-orange-50">
      {/* Status Bar Space */}
      <View className="h-12" />
      
      {/* Profile Header */}
      <View className="items-center px-6 pt-4 pb-8">
        <View className="w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-md">
          {userData.profileImage ? (
            <Image 
              // source={{ uri: userData.profileImage }} 
              className="w-full h-full" 
              resizeMode="cover"
            />
          ) : (
            <Image 
              // source={require('../assets/default-profile.png')} 
              className="w-full h-full" 
              resizeMode="cover"
            />
          )}
        </View>
        
        <Text className="mt-4 text-2xl font-bold text-orange-500">{userData.name}</Text>
        <Text className="text-orange-400">{userData.username}</Text>
      </View>
      
      <ScrollView className="flex-1 p-5 bg-white rounded-t-3xl">
        {/* Account Section */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-2 text-base">Akun</Text>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-lg mb-2 border-2 border-gray-100"

          >
             <Image 
                source={require('../../assets/EditProfileIcon.png')} 
              />
            <Text className="ml-3 text-gray-800 font-medium">Ubah Profil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl mb-2 border-2 border-gray-100"
          >
            <View className="w-6 h-6 items-center justify-center">
              <Image 
                source={require('../../assets/DiamondIcon.png')} 
                className="w-full h-full" 
                resizeMode="contain"
              />
            </View>
            <Text className="ml-3 text-gray-800 font-medium">Premium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl border-2 border-gray-100"
          >
            <Image 
                source={require('../../assets/SettingIcon.png')} 
              />
            <Text className="ml-3 text-gray-800 font-medium">Pengaturan</Text>
          </TouchableOpacity>
        </View>
        
        {/* General Section */}
        <View className="mb-6">
          <Text className="text-gray-500 mb-2 text-base">Umum</Text>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl mb-2 border-2 border-gray-100"

          >
            <Image 
                source={require('../../assets/BantuanIcon.png')} 
              />
            <Text className="ml-3 text-gray-800 font-medium">Pusat Bantuan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl mb-2 border-2 border-gray-100"

          >
            <Image 
                source={require('../../assets/ShieldIcon.png')} 
              />
            <Text className="ml-3 text-gray-800 font-medium">Syarat dan Ketentuan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl mb-2 border-2 border-gray-100"
          >
            <Image 
                source={require('../../assets/TentangIcon.png')} 
              />
            <Text className="ml-3 text-gray-800 font-medium">Tentang</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-row items-center bg-white p-4 rounded-2xl border-2 border-gray-100"
            
          >
            <ArrowRightOnRectangleIcon size={24} color="#EF4444" />
            <Text className="ml-3 text-red-500 font-medium">Keluar Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
    </View>
  );
}