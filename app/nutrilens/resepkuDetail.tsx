"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"

type RecipeDetailParams = {
  id: string
  name: string
  calories: number
  weight: number
  unit: string
}

export default function ResepKuDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const [activeTab, setActiveTab] = useState("Bahan-bahan")
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Get recipe details from route params
  const { id, name, calories, weight } = route.params as RecipeDetailParams

  // Dummy data for recipe details
  const recipeDetails = {
    prepTime: "10 menit",
    difficulty: "Mudah",
    ingredients: [
      "2 lembar roti gandum utuh",
      "1/2 buah alpukat matang",
      "6-8 buah tomat ceri, dibelah dua",
      "1 butir telur",
      "1 sdt minyak zaitun (untuk menggoreng telur)",
      "Garam dan lada secukupnya",
      "Perasan air lemon (opsional)",
    ],
    instructions: [
      "Panggang roti gandum hingga kecokelatan dan renyah.",
      "Kupas dan haluskan alpukat, beri sedikit perasan lemon agar tidak menghitam.",
      "Oleskan alpukat yang sudah dihaluskan di atas roti.",
      "Panaskan minyak zaitun di wajan, goreng telur mata sapi.",
      "Letakkan telur mata sapi di atas salah satu roti yang sudah diolesi alpukat.",
      "Susun potongan tomat ceri di atas roti lainnya.",
      "Beri garam dan lada secukupnya.",
      "Gabungkan kedua roti atau sajikan secara terpisah.",
    ],
    nutrition: {
      carbs: 32,
      protein: 13,
      fat: 21,
      fiber: 7,
    },
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header with back button and bookmark */}
        <View className="relative">
          <Image source={require("../../assets/LoadingImg.png")} className="w-full h-56" resizeMode="cover" />
          <View className="absolute top-4 left-4 right-4 flex-row justify-between">
            <TouchableOpacity onPress={toggleBookmark} className="bg-white rounded-full p-2 ">
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color={isBookmarked ? "#10B981" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recipe Title and Info */}
        <View className="p-4">
          <Text className="text-2xl font-bold mb-2">{name}</Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <Ionicons name="time-outline" size={18} color="#6B7280" />
              <Text className="text-gray-600 ml-1">{recipeDetails.prepTime}</Text>
            </View>
            <View className="bg-green-100 rounded-lg px-3 py-1">
              <Text className="text-green-600">{recipeDetails.difficulty}</Text>
            </View>
          </View>

          {/* Nutrition Info */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg font-semibold">{weight} gram</Text>
              <View className="flex-1 items-end">
                <View className="bg-white rounded-full w-16 h-16 items-center justify-center border-8 border-orange-400">
                  <Text className="text-lg font-bold">{calories}</Text>
                  <Text className="text-xs">kkal</Text>
                </View>
              </View>
            </View>

            <View className="flex-row mb-2">
              <View
                className="h-3 bg-purple-400"
                style={{ width: `${(recipeDetails.nutrition.carbs / 100) * 100}%` }}
              />
              <View
                className="h-3 bg-blue-400"
                style={{ width: `${(recipeDetails.nutrition.protein / 100) * 100}%` }}
              />
              <View className="h-3 bg-orange-400" style={{ width: `${(recipeDetails.nutrition.fat / 100) * 100}%` }} />
              <View className="h-3 bg-green-400" style={{ width: `${(recipeDetails.nutrition.fiber / 100) * 100}%` }} />
            </View>

            <View className="flex-row flex-wrap">
              <View className="flex-row items-center mr-4 mb-1">
                <View className="w-3 h-3 bg-purple-400 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">{recipeDetails.nutrition.carbs}g Karbohidrat</Text>
              </View>
              <View className="flex-row items-center mr-4 mb-1">
                <View className="w-3 h-3 bg-blue-400 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">{recipeDetails.nutrition.protein}g Protein</Text>
              </View>
              <View className="flex-row items-center mr-4 mb-1">
                <View className="w-3 h-3 bg-orange-400 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">{recipeDetails.nutrition.fat}g Lemak</Text>
              </View>
              <View className="flex-row items-center mb-1">
                <View className="w-3 h-3 bg-green-400 rounded-full mr-1" />
                <Text className="text-xs text-gray-600">{recipeDetails.nutrition.fiber}g Serat</Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row border-[1px] rounded-full border-gray-100 mb-4">
            <TouchableOpacity
              className={`py-3 px-12  ${activeTab === "Bahan-bahan" ? "rounded-full bg-green-500  " : ""}`}
              onPress={() => setActiveTab("Bahan-bahan")}
            >
              <Text className={`${activeTab === "Bahan-bahan" ? "text-gray-500 " : "text-gray-500"}`}>
                Bahan-bahan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`py-3 px-12 ${activeTab === "Cara Membuat" ? "rounded-full bg-green-500" : ""}`}
              onPress={() => setActiveTab("Cara Membuat")}
            >
              <Text className={`${activeTab === "Cara Membuat" ? "text-gray-500" : "text-gray-500"}`}>
                Cara Membuat
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "Bahan-bahan" ? (
            <View className="border-[1px] border-gray-100 rounded-2xl p-4 mb-4">
              {recipeDetails.ingredients.map((ingredient, index) => (
                <View key={index} className="flex-row">
                  <Text className="text-black">• {ingredient}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View className="border-[1px] border-gray-100 rounded-2xl p-4 mb-4">
              {recipeDetails.instructions.map((step, index) => (
                <View key={index} className="">
                  <Text className="text-black">
                    {index + 1}. {step}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
