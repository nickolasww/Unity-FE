import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Filter } from 'react-native-feather';
import { Doctor } from '../../utils/konsultasitypes';
import { ThumbsUp } from 'react-native-feather';

// Data dokter
const doctors: Doctor[] = [
  {
    id: '1',
    name: 'dr. Selvi',
    specialty: 'Gizi Klinik',
    price: 'Rp100.000',
    rating: '98%',
    image: null,
  },
  {
    id: '2',
    name: 'dr. Echa',
    specialty: 'Gizi Klinik',
    price: 'Rp100.000',
    rating: '98%',
    image: null,
  },
  {
    id: '3',
    name: 'dr. Rizka',
    specialty: 'Gizi Anak',
    price: 'Rp100.000',
    rating: '98%',
    image: null,
  },
  {
    id: '4',
    name: 'dr. Robin',
    specialty: 'Nutritionist',
    price: 'Rp100.000',
    rating: '98%',
    image: null,
  },
  {
    id: '5',
    name: 'dr. Wewe',
    specialty: 'Ahli Gizi',
    price: 'Rp100.000',
    rating: '98%',
    image: null,
  },
  {
    id: '6',
    name: 'dr. Hanindita',
    specialty: 'Gizi Klinik',
    price: 'Rp100.000',
    rating: '98%',
    image: null,
  },
];

export default function KonsultasiPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
          source={{ uri: 'https://via.placeholder.com/64x64/22C55E/FFFFFF?text=👩‍⚕️' }}
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-6 bg-white ">
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

      <View className="p-4 flex-row  items-center gap-5">
        <View className=" w-[80%] bg-white rounded-lg">
          <TextInput
            className="flex-1 p-3"
            placeholder="Temukan konsultanmu"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
          <TouchableOpacity className="bg-green-500 p-3 rounded-lg">
           <Image source={require("../../assets/FilterIcon.png")}/>
          </TouchableOpacity>
      </View>

      <FlatList
        data={doctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
}