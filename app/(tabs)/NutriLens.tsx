"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { FoodItem } from "../../utils/foodtypes"
import FoodHistoryItem from "../../components/foodhistory/foodhistoryitem"

// Data dummy untuk riwayat makanan
const initialFoodHistory: FoodItem[] = [
  { id: "1", name: "Nasi Goreng", calories: 350, weight: 200, unit: "g" },
  { id: "2", name: "Telur Mata Sapi", calories: 90, weight: 1, unit: "butir" },
  { id: "3", name: "Udang", calories: 30, weight: 30, unit: "g" },
  { id: "4", name: "Kerupuk", calories: 75, weight: 15, unit: "g" },
]

// Data dummy untuk saran makanan
const suggestedFoods: FoodItem[] = [
  { id: "5", name: "Nasi Putih", calories: 350, weight: 200, unit: "g" },
  { id: "6", name: "Telur Mata Sapi", calories: 90, weight: 1, unit: "butir" },
  { id: "7", name: "Udang", calories: 30, weight: 30, unit: "g" },
]

// Opsi untuk dropdown
const mealOptions = ["Sarapan", "Makan Siang", "Makan Malam", "Camilan"]

export default function NutriLensScreen() {
  const [selectedMeal, setSelectedMeal] = useState("Sarapan")
  const [showMealOptions, setShowMealOptions] = useState(false)
  const [activeTab, setActiveTab] = useState("NutriKu")
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>(initialFoodHistory)
  const [searchText, setSearchText] = useState("")

  const navigation = useNavigation()

  const handleScanFood = () => {
    // Implementasi logika untuk membuka kamera dan scan makanan
    console.log("Scanning food...")
    // Navigasi ke screen kamera (belum diimplementasikan)
    // navigation.navigate('FoodScannerScreen');
  }

  const handleScanIngredients = () => {
    // Implementasi logika untuk scan bahan-bahan
    console.log("Scanning ingredients...")
    // Navigasi ke screen scanner bahan (belum diimplementasikan)
    // navigation.navigate('IngredientScannerScreen');
  }

  const handleAddFood = (food: FoodItem) => {
    // Tambahkan makanan ke riwayat
    const newFood = { ...food, id: Date.now().toString() }
    setFoodHistory([...foodHistory, newFood])
  }

  const handleMealSelect = (meal: string) => {
    setSelectedMeal(meal)
    setShowMealOptions(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-3">

      <ScrollView className="flex-1 p-4 bg-white rounded-lg">
        {/* Meal Selector Dropdown */}
        <View className="relative mb-4">
          <TouchableOpacity
            className="border border-orange-500 rounded-full px-4 py-2 flex-row items-center"
            style={{ width: 120 }}
            onPress={() => setShowMealOptions(!showMealOptions)}
          >
            <Text className="text-orange-500 mr-2">{selectedMeal}</Text>
            <Ionicons name={showMealOptions ? "chevron-up" : "chevron-down"} size={16} color="#FF5733" />
          </TouchableOpacity>

          {showMealOptions && (
            <View className="absolute top-12 left-0 bg-white rounded-lg shadow-md z-10 w-40">
              {mealOptions.map((meal) => (
                <TouchableOpacity
                  key={meal}
                  className="px-4 py-2 border-b border-gray-100"
                  onPress={() => handleMealSelect(meal)}
                >
                  <Text>{meal}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Scan Options */}
        <View className="flex-row justify-between mb-4">
          {/* Scan Food */}
          <TouchableOpacity className="bg-red-100 rounded-lg p-4 w-[48%] items-center" onPress={handleScanFood}>
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
          <TouchableOpacity
            className="bg-green-100 rounded-lg p-4 w-[48%] items-center"
            onPress={handleScanIngredients}
          >
            <View className="w-16 h-16 mb-2 items-center justify-center">
              <View className="absolute">
                <MaterialCommunityIcons name="square-rounded-outline" size={48} color="#22C55E" />
              </View>
              <MaterialCommunityIcons name="barcode-scan" size={24} color="#22C55E" />
            </View>
            <Text className="text-center font-semibold text-green-500">Scan Bahan-bahanmu</Text>
            <Text className="text-center text-xs text-gray-600 mt-1">
              Dapatkan resep dari bahan-bahan yang kamu punya!
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-full flex-row items-center px-4 py-3 mb-4 shadow-sm">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="ml-2 flex-1"
            placeholder="Temukan makanan"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Tabs */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === "NutriKu" ? "bg-orange-500" : "bg-white"} rounded-l-lg items-center`}
            onPress={() => setActiveTab("NutriKu")}
          >
            <Text className={activeTab === "NutriKu" ? "text-white font-bold" : "text-gray-500"}>NutriKu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 ${activeTab === "ResepKu" ? "bg-orange-500" : "bg-white"} rounded-r-lg items-center`}
            onPress={() => setActiveTab("ResepKu")}
          >
            <Text className={activeTab === "ResepKu" ? "text-white font-bold" : "text-gray-500"}>ResepKu</Text>
          </TouchableOpacity>
        </View>

        {activeTab === "NutriKu" ? (
          <>
            {/* Food History */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-2">Riwayat</Text>
              <Text className="text-sm text-gray-600 mb-4">Berikut asupan yang pernah kamu rekam nutrisinya.</Text>

              {foodHistory.map((food) => (
                <FoodHistoryItem key={food.id} food={food} />
              ))}
            </View>

            {/* Suggestions */}
            <View className="mb-6">
              <Text className="text-lg font-bold mb-2">Saran</Text>
              <Text className="text-sm text-gray-600 mb-4">Berikut asupan yang mungkin kamu konsumsi.</Text>

              {suggestedFoods.map((food) => (
                <FoodHistoryItem key={food.id} food={food} showAddButton onAddPress={() => handleAddFood(food)} />
              ))}
            </View>
          </>
        ) : (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500">Fitur ResepKu akan segera hadir!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
