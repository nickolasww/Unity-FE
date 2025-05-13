import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

interface ScanOptionsProps {
  onScanFood: () => void
  onScanIngredients: () => void
}

export const ScanOptions: React.FC<ScanOptionsProps> = ({ onScanFood, onScanIngredients }) => {
  return (
    <View className="flex-row justify-between mb-4">
      {/* Scan Food */}
      <TouchableOpacity className="bg-red-100 rounded-lg p-4 w-[48%] items-center" onPress={onScanFood}>
        <View className="w-16 h-16 mb-2 items-center justify-center">
          <View className="absolute">
            <MaterialCommunityIcons name="square-rounded-outline" size={48} color="#FF5733" />
          </View>
          <Ionicons name="camera" size={24} color="#FF5733" />
        </View>
        <Text className="text-center font-semibold text-red-500">Scan Makananmu</Text>
        <Text className="text-center text-xs text-gray-600 mt-1">Ketahui kandungan nutrisi asupan makananmu</Text>
      </TouchableOpacity>

      {/* Scan Ingredients */}
      <TouchableOpacity className="bg-green-100 rounded-lg p-4 w-[48%] items-center" onPress={onScanIngredients}>
        <View className="w-16 h-16 mb-2 items-center justify-center">
          <View className="absolute">
            <MaterialCommunityIcons name="square-rounded-outline" size={48} color="#22C55E" />
          </View>
          <MaterialCommunityIcons name="barcode-scan" size={24} color="#22C55E" />
        </View>
        <Text className="text-center font-semibold text-green-500">Scan Bahan-bahanmu</Text>
        <Text className="text-center text-xs text-gray-600 mt-1">Dapatkan resep dari bahan-bahan yang kamu punya!</Text>
      </TouchableOpacity>
    </View>
  )
}
