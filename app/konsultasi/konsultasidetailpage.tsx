import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Modal } from 'react-native';
import { ThumbsUp } from 'react-native-feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Doctor } from '../../utils/konsultasitypes';
import VerificationModal from '../../components/modal/verificationModal';

export default function KonsultasiDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Parse doctor data dari params
  const doctor: Doctor = params.doctor ? JSON.parse(params.doctor as string) : {
    id: '1',
    name: 'dr. Selvi',
    specialty: 'Gizi Klinik',
    price: 'Rp100.000',
    rating: '98%',
    image: null
  };
  
  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedTime, setSelectedTime] = useState('14.00');
  const [complaint, setComplaint] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const dates = [
    { day: 'Min', date: 11 },
    { day: 'Sen', date: 12 },
    { day: 'Sel', date: 13 },
    { day: 'Rab', date: 14 },
    { day: 'Kam', date: 15 },
    { day: 'Jum', date: 16 },
    { day: 'Sab', date: 17 },
  ];

  const times = ['09.00', '10.00', '11.00', '14.00'];

  const handleSchedule = () => {
    if (isVerified) {
      router.push({
        pathname: '/konsultasi/detailreservasi',
        params: {
          doctor: JSON.stringify(doctor),
          selectedDate: selectedDate.toString(),
          selectedTime,
          isVerified: 'true'
        }
      });
    } else {
      setModalVisible(true);
    }
  };

  const handleVerify = () => {
    setModalVisible(false);
    router.push('/konsultasi/verifikasiemailpage');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView>
        <View className="bg-white m-4 p-4 rounded-lg">
          <View className="items-center">
            <Image 
              source={{ uri: 'https://via.placeholder.com/96x96/22C55E/FFFFFF?text=👩‍⚕️' }}
              className="w-24 h-24 rounded-lg" 
            />
            <Text className="text-lg font-bold mt-2">{doctor.name}</Text>
            <View className="bg-green-50 px-3 py-1 rounded-full mt-1">
              <Text className="text-green-500">{doctor.specialty}</Text>
            </View>
          </View>

          <View className="mt-4 space-y-2">
            <View className="flex-row items-center">
            <Image source={require("../../assets/BuildIcon.png")}/>
              <Text className="ml-2 text-gray-700">RSGM Universitas Indonesia</Text>
              <View className="ml-auto flex-row items-center">
                <ThumbsUp stroke="#666" width={16} height={16} />
                <Text className="ml-1">{doctor.rating}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Image source={require("../../assets/BagIcon.png")}/>
              <Text className="ml-2 text-gray-700">5 Tahun Pengalaman</Text>
            </View>
            <View className="flex-row items-center">
              <Image source={require("../../assets/MoneyIcon.png")}/>
              <Text className="ml-2 text-gray-700">{doctor.price}/sesi</Text>
            </View>
          </View>
        </View>

        {/* Jadwal Tersedia - Diperbarui sesuai dengan desain */}
        <View className="bg-white m-4 p-4 rounded-lg">
          <Text className="font-medium text-lg">Jadwal Tersedia</Text>
          <Text className="text-gray-500 mt-1 mb-4">Mei 2025</Text>

          {/* Grid tanggal dengan hari dan angka */}
          <View className="flex-row justify-between mb-6">
            {dates.map((item) => (
              <View key={item.date} className="items-center">
                <Text className="text-gray-500 mb-2">{item.day}</Text>
                <TouchableOpacity
                  className={`items-center justify-center ${
                    selectedDate === item.date 
                      ? 'bg-green-500 w-10 h-10 rounded-full' 
                      : ''
                  }`}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text 
                    className={`text-lg ${
                      selectedDate === item.date 
                        ? 'text-white font-bold' 
                        : 'text-black'
                    }`}
                  >
                    {item.date}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text className="font-medium text-gray-500 mb-3">Sesi Online</Text>
          <View className="flex-row justify-between">
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                className={`border rounded-full py-2 px-4 ${
                  selectedTime === time 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300'
                }`}
                onPress={() => setSelectedTime(time)}
              >
                <Text 
                  className={`${
                    selectedTime === time 
                      ? 'text-white' 
                      : 'text-gray-700'
                  }`}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="bg-white m-4 p-4 rounded-lg">
          <Text className="font-medium mb-2">Keluhan</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 h-20"
            placeholder="Ketik di sini jika diperlukan"
            multiline
            value={complaint}
            onChangeText={setComplaint}
          />
        </View>
      </ScrollView>

      <View className="p-4 bg-white">
        <TouchableOpacity
          className="bg-green-500 py-4 rounded-lg items-center"
          onPress={handleSchedule}
        >
          <Text className="text-white font-medium">Buat Jadwal</Text>
        </TouchableOpacity>
      </View>

      <VerificationModal
        visible={modalVisible}
        onVerify={handleVerify}
        onLater={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}