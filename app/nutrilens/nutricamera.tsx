"use client"

import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { requestCameraPermission, takePicture, recognizeFood } from "../../services/nutricameraservice"
import type { FoodItem } from "../../utils/foodtypes"

export default function NutriCamera() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [recognizedFood, setRecognizedFood] = useState<FoodItem | null>(null)

  const navigation = useNavigation()

  useEffect(() => {
    ;(async () => {
      const granted = await requestCameraPermission()
      setHasPermission(granted)
    })()
  }, [])

  const handleTakePicture = async () => {
    const uri = await takePicture()
    if (uri) {
      setImageUri(uri)
      setLoading(true)

      try {
        const food = await recognizeFood(uri)
        setRecognizedFood(food)
      } catch (error) {
        console.error("Error recognizing food:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSaveFood = () => {
    // Simpan makanan ke riwayat dan kembali ke layar utama
    // Dalam aplikasi nyata, ini akan menyimpan ke database lokal atau server
    navigation.goBack()
  }

  const handleRetake = () => {
    setImageUri(null)
    setRecognizedFood(null)
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Meminta izin kamera...</Text>
      </SafeAreaView>
    )
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4">
          Tidak ada akses ke kamera. Mohon berikan izin kamera di pengaturan perangkat Anda.
        </Text>
        <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-lg" onPress={() => navigation.goBack()}>
          <Text className="text-white font-bold">Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-center items-center p-4">
        {!imageUri ? (
          <View className="items-center">
            <View className="w-64 h-64 bg-gray-200 rounded-lg mb-6 items-center justify-center">
              <Ionicons name="camera" size={48} color="gray" />
            </View>
            <Text className="text-center mb-6">Ambil foto makanan untuk mengetahui kandungan nutrisinya</Text>
            <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-lg" onPress={handleTakePicture}>
              <Text className="text-white font-bold">Ambil Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center w-full">
            <Image source={{ uri: imageUri }} className="w-64 h-64 rounded-lg mb-6" resizeMode="cover" />

            {loading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#FF5733" />
                <Text className="mt-4">Menganalisis makanan...</Text>
              </View>
            ) : recognizedFood ? (
              <View className="w-full">
                <View className="bg-white rounded-lg p-4 mb-6 shadow-sm w-full">
                  <Text className="font-bold text-lg mb-2">{recognizedFood.name}</Text>
                  <View className="flex-row">
                    <View className="bg-red-100 rounded-lg px-3 py-1 mr-3">
                      <Text className="text-orange-500">{recognizedFood.calories} kkal</Text>
                    </View>
                    <View className="bg-green-100 rounded-lg px-3 py-1">
                      <Text className="text-green-500">
                        {recognizedFood.weight} {recognizedFood.unit}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row justify-between">
                  <TouchableOpacity className="bg-gray-300 py-3 px-6 rounded-lg" onPress={handleRetake}>
                    <Text className="font-semibold">Ambil Ulang</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-lg" onPress={handleSaveFood}>
                    <Text className="text-white font-bold">Simpan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <Text className="text-red-500 mb-4">Tidak dapat mengenali makanan. Silakan coba lagi.</Text>
                <TouchableOpacity className="bg-orange-500 py-3 px-6 rounded-lg" onPress={handleRetake}>
                  <Text className="text-white font-bold">Ambil Ulang</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}
