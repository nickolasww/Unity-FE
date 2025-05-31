"use client";

import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Filter } from 'react-native-feather';
import { Doctor } from '../../utils/konsultasitypes';
import { ThumbsUp } from 'react-native-feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://nutripath.bccdev.id/api/v1/doctors/get-all';

const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const url = API_BASE_URL;

    console.log("🔗 Fetching URL:", url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();

      console.error("❌ HTTP Error Detail:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`);
    }

    const data = await response.json();
    console.log("🧾 Full response JSON:", data);

    if (!Array.isArray(data.doctors)) {
      throw new Error("❌ Unexpected data format: 'doctors' is not an array");
    }

    return data.doctors; // ✅ gunakan key yang benar
  } catch (error: any) {
    console.error('🚨 Error fetching doctors:', error.message || error);
    throw error;
  }
};



export default function KonsultasiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  // Debounced search - delay pencarian untuk mengurangi API calls
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchQuery.trim()) {
        searchDoctors(searchQuery);
      } else {
        loadDoctors();
      }
    }, 500); // Delay 500ms setelah user berhenti mengetik

    setSearchTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [searchQuery]);

    const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await fetchDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      Alert.alert(
        'Error',
        'Gagal memuat data dokter. Silakan coba lagi.',
        [
          { text: 'Retry', onPress: () => loadDoctors() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = async (query: string) => {
    try {
      setLoading(true);
      const doctorsData = await fetchDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      Alert.alert('Error', 'Gagal mencari dokter. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDoctors();
      setSearchQuery(''); 
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

    const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      className="bg-white p-4 mb-2 rounded-lg"
      onPress={() => router.push({
        pathname: '/konsultasi/konsultasidetailpage',
        params: { doctor: JSON.stringify(item) }
      })}
    >
      <View className="flex-row items-center">
        <Image 
          source={
            item.image && typeof item.image === 'string'
              ? { uri: item.image } 
              : item.image 
              ? item.image 
              : { uri: 'https://via.placeholder.com/64x64/22C55E/FFFFFF?text=👩‍⚕️' }
          }
          className="w-16 h-16 rounded-lg" 
        />
        <View className="ml-3 flex-1">
          <Text className="text-base font-medium">{item.name}</Text>
          <View className="flex-row items-center">
            <Text className="text-base font-medium">{item.price}</Text>
            <View className="flex-row items-center ml-2">
              <ThumbsUp stroke="#666" width={10} height={10} />
              <Text className="text-xs text-gray-500"> {item.rating}</Text>
            </View>
          </View>
          <View className="mt-1">
            <Text className="text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-full self-start">
              {item.specialty}
            </Text>
          </View>
        </View>
        <TouchableOpacity className="border border-green-500 rounded-lg px-3 py-2">
          <Text className="text-green-500">Lihat Profil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

   const renderEmptyComponent = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Text className="text-gray-500 text-center">
        {searchQuery ? 'Tidak ada dokter yang ditemukan' : 'Belum ada data dokter'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity 
          className="mt-4 bg-green-500 px-4 py-2 rounded-lg"
          onPress={loadDoctors}
        >
          <Text className="text-white">Muat Ulang</Text>
        </TouchableOpacity>
      )}
    </View>
  );

   const renderLoadingComponent = () => (
    <View className="flex-1 justify-center items-center py-10">
      <Text className="text-gray-500 mt-2">Memuat data dokter...</Text>
    </View>
  );

  return (
 <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-6 bg-white">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-xl font-medium">Konsultasi</Text>
          <TouchableOpacity>
            <Calendar stroke="#000" width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="p-4 flex-row items-center gap-5">
        <View className="w-[80%] bg-white rounded-lg">
          <TextInput
            className="flex-1 p-3"
            placeholder="Temukan konsultanmu"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity className="bg-green-500 p-3 rounded-lg">
          <Image source={require("../../assets/FilterIcon.png")} />
        </TouchableOpacity>
      </View>

      {loading && doctors.length === 0 ? (
        renderLoadingComponent()
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}