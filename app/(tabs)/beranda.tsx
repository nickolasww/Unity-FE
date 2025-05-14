"use client"
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { useRouter } from "expo-router"

export default function BerandaScreen() {
  const router = useRouter()

  const navigateToPoin = () => {
    router.push("/beranda/poin")
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 ">
      {/* Header */}
      <View className=" flex-column bg-white ">
          <View className="flex-row justify-between items-center p-4">
        <View className="flex-row items-center gap-3">
          <Image source={require("../../assets/profile.png")} className="w-12 h-12 rounded-full" />
          <View>
            <Text className="text-lg font-semibold">Hai, Rizka!</Text>
            <TouchableOpacity className="flex-row items-center mt-1" onPress={navigateToPoin}>
              <Image source={require("../../assets/Coin.png")} className="w-4 h-4 mr-1" />
              <Text className="text-amber-500 text-sm">120 Poin</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center">
          <Icon name="bell" size={24} color="#666" className="mr-4" />
          <Icon name="gift" size={24} color="#666" />
        </View>
        </View> 
         {/* Nutrition Summary */}
        <View className="bg-orange-50 rounded-lg p-4 mb-4">
          <Text className="font-medium mb-2">Ringkasan nutrisimu hari ini</Text>
          <View className="space-y-1">
            <Text className="text-sm">
              Konsumsi kalori hari ini: <Text className="font-semibold text-red-500">2.102 kkal</Text>
            </Text>
            <Text className="text-sm">
              Batas kalori harian: <Text className="font-semibold">2.000 kkal</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 p-3" showsVerticalScrollIndicator={false}>
        {/* Feature Buttons */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between">
            <View className="items-center w-[30%]">
              <View className="w-12 h-12 bg-purple-100 rounded-lg justify-center items-center mb-1">
                <Icon name="box" size={24} color="#9333ea" />
              </View>
              <Text className="text-xs font-medium">BMI</Text>
            </View>
            <View className="items-center w-[30%]">
              <View className="w-12 h-12 bg-amber-100 rounded-lg justify-center items-center mb-1">
                <Icon name="layers" size={24} color="#f59e0b" />
              </View>
              <Text className="text-xs font-medium">Misi</Text>
            </View>
            <View className="items-center w-[30%]">
              <View className="w-12 h-12 bg-emerald-100 rounded-lg justify-center items-center mb-1">
                <Icon name="clipboard" size={24} color="#10b981" />
              </View>
              <Text className="text-xs font-medium">Konsultasi</Text>
            </View>
          </View>
        </View>

        {/* Promo Banner */}
        <View className="relative mb-4">
          <Image
            source={{ uri: "https://via.placeholder.com/400x180" }}
            className="w-full h-[180px] rounded-lg"
            resizeMode="cover"
          />
          <View className="absolute bottom-2 flex-row self-center gap-1">
            <View className="w-2 h-2 rounded-full bg-gray-800" />
            <View className="w-2 h-2 rounded-full bg-gray-400" />
            <View className="w-2 h-2 rounded-full bg-gray-400" />
          </View>
        </View>

        {/* Rekomendasi Resep */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-medium">Rekomendasi resep sehat</Text>
          <TouchableOpacity>
            <Text className="text-sm text-emerald-600">Lihat Selengkapnya</Text>
          </TouchableOpacity>
        </View>

        <RecipeCard
          image="https://via.placeholder.com/80"
          title="Roti Lapis Alpukat"
          calories="300 kkal"
          weight="380g"
        />
        <RecipeCard
          image="https://via.placeholder.com/80"
          title="Smoothie Pisang Oat"
          calories="180 kkal"
          weight="180g"
        />
        <RecipeCard
          image="https://via.placeholder.com/80"
          title="Telur Orak Arik Sayur"
          calories="150 kkal"
          weight="150g"
        />

        {/* Artikel */}
        <View className="flex-row justify-between items-center mb-3 mt-4">
          <Text className="text-lg font-medium">Artikel</Text>
          <TouchableOpacity>
            <Text className="text-sm text-emerald-600">Lihat Selengkapnya</Text>
          </TouchableOpacity>
        </View>

        <ArticleCard
          image="https://via.placeholder.com/80"
          title="6 Fakta Temuan Pakar Nutrisi Soal Konsumsi Protein Berlebih"
          source="Tempo.com"
          date="10 Mei 2025"
        />
        <ArticleCard
          image="https://via.placeholder.com/80"
          title="Nutrisi Sehat sebagai Pendekatan Humanis dalam Pembinaan Anak"
          source="Kompasiana"
          date="10 Mei 2025"
        />

        {/* Bottom padding to ensure content isn't hidden by tab bar */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  )
}

// Component untuk kartu resep
function RecipeCard({ image, title, calories, weight }) {
  return (
    <View className="bg-white rounded-lg p-3 mb-3 flex-row justify-between items-center shadow-sm">
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: image }} className="w-16 h-16 rounded-lg" />
        <View className="gap-1">
          <Text className="font-medium">{title}</Text>
          <View className="flex-row gap-2 mt-1">
            <Text className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">{calories}</Text>
            <Text className="text-xs px-2 py-0.5 bg-green-100 text-green-600 rounded">{weight}</Text>
          </View>
        </View>
      </View>
      <View className="w-6 h-6 border border-gray-300 rounded" />
    </View>
  )
}

// Component untuk kartu artikel
function ArticleCard({ image, title, source, date }) {
  return (
    <View className="bg-white rounded-lg p-3 mb-3 flex-row gap-3 shadow-sm">
      <Image source={{ uri: image }} className="w-16 h-16 rounded-lg" />
      <View className="flex-1 justify-between">
        <Text className="font-medium text-sm">{title}</Text>
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500">{source}</Text>
          <View className="flex-row items-center gap-1">
            <Icon name="calendar" size={12} color="#999" />
            <Text className="text-xs text-gray-500">{date}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

// Component untuk tombol navigasi
function NavButton({ icon, label, isActive, onPress }) {
  return (
    <TouchableOpacity className="items-center justify-center w-16" onPress={onPress}>
      <Icon name={icon} size={24} color={isActive ? "#f97316" : "#777"} />
      <Text className={`text-xs mt-1 ${isActive ? "text-orange-500" : "text-gray-500"}`}>{label}</Text>
    </TouchableOpacity>
  )
}
