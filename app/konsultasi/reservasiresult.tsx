  import React from 'react';
  import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
  import { useRouter } from 'expo-router';

  export default function ReservasiResult() {
    const router = useRouter();

    const handleOke = () => {
      router.replace('/tabs)/beranda');
    };

    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Image 
            source={require("../../assets/ResultImg.png")}
            className="w-60 h-60" 
            resizeMode="contain" 
          />
          
          <Text className="text-2xl font-bold text-green-500 mt-6">
            Periksa Email Kamu
          </Text>
          
          <Text className="text-center mt-3 text-gray-700">
            Reservasi berhasil! Silahkan periksa email untuk mendapatkan tautan konsultasi online dan detail reservasi kamu.
          </Text>
        </View>

        <View className="p-4">
          <TouchableOpacity
            className="bg-green-500 py-4 rounded-lg items-center"
            onPress={handleOke}
          >
            <Text className="text-white font-medium">Oke</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }