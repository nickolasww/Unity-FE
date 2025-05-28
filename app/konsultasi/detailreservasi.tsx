import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { ArrowLeft, AlertCircle } from 'react-native-feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Doctor } from '../../utils/konsultasitypes';

export default function DetailReservasi() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse parameters
  const doctor: Doctor = params.doctor ? JSON.parse(params.doctor as string) : {
    id: '1',
    name: 'dr. Selvi',
    specialty: 'Gizi Klinik',
    price: 'Rp100.000',
    rating: '98%',
    image: null
  };
  
  const selectedDate = params.selectedDate ? parseInt(params.selectedDate as string) : 14;
  const selectedTime = params.selectedTime as string || '14.00';

  const handlePayment = () => {
    // Simulasi pembayaran Midtrans
    Alert.alert(
      "Pembayaran",
      "Anda akan diarahkan ke halaman pembayaran Midtrans",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        { 
          text: "Lanjutkan", 
          onPress: () => {
            // Simulasi pembayaran berhasil
            setTimeout(() => {
              router.push('/konsultasi/reservasiresult');
            }, 1500);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-white m-4 p-4 rounded-lg">
        <View className="flex-row items-center">
          <Image 
            source={{ uri: 'https://via.placeholder.com/64x64/22C55E/FFFFFF?text=👩‍⚕️' }}
            className="w-16 h-16 rounded-lg" 
          />
          <View className="ml-3">
            <Text className="font-medium">{doctor.name}</Text>
            <View className="bg-green-50 px-2 py-0.5 rounded-full mt-1">
              <Text className="text-green-500 text-xs">{doctor.specialty}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="bg-white m-4 p-4 rounded-lg">
        <Text className="font-medium text-lg mb-2">Detail Konsultasi</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="bg-gray-100 p-2 rounded-lg mr-3">
              <Text className="text-gray-600">📅</Text>
            </View>
            <View>
              <Text className="font-medium">Selasa, {selectedDate} Mei 2025</Text>
              <Text className="text-gray-500">{selectedTime} - {selectedTime.split('.')[0]}:30 WIB</Text>
            </View>
          </View>
          <View>
            <Text className="text-right">Metode Konsultasi</Text>
            <Text className="text-right font-medium">Online</Text>
          </View>
        </View>
      </View>

      <View className="bg-white m-4 p-4 rounded-lg">
        <Text className="font-medium text-lg mb-2">Detail Pembayaran</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Biaya Konsultasi</Text>
          <Text className="font-medium">Rp100.000</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-600">Biaya Admin</Text>
          <Text className="font-medium">Rp2.000</Text>
        </View>
        <View className="border-t border-gray-200 pt-3">
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Total Pembayaran</Text>
            <Text className="font-medium text-green-500">Rp102.000</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Metode Pembayaran</Text>
            <Text className="font-medium">Virtual Akun</Text>
          </View>
        </View>
      </View>

      <View className="bg-white m-4 p-4 rounded-lg flex-row items-start">
        <AlertCircle stroke="#F59E0B" width={20} height={20} />
        <Text className="text-yellow-500 ml-2 flex-1">
          Setelah pembayaran berhasil, tautan konsultasi online akan dikirimkan melalui email kamu.
        </Text>
      </View>

      <View className="flex-1" />

      <View className="p-4 bg-white">
        <TouchableOpacity
          className="bg-green-500 py-4 rounded-lg items-center"
          onPress={handlePayment}
        >
          <Text className="text-white font-medium">Bayar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}