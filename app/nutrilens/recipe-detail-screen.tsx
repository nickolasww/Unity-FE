import type React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { Recipe } from "../../utils/foodtypes"

interface RecipeDetailScreenProps {
  recipe: Recipe
  activeTab: string
  onTabChange: (tab: string) => void
  onBack: () => void
  onSave: () => void
}

// Update RecipeDetailScreen to include steps tab
export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  activeTab,
  onTabChange,
  onBack,
  onSave,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-white">
        <View className="p-4 flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-2">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1 items-end">
          </View>
        </View>

        <ScrollView className="flex-1">

          {/* Recipe Title and Info */}
          <View className="p-4">
            <Text className="text-2xl font-bold mb-2">{recipe.name}</Text>
            <View className="flex-row items-center mb-4">
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text className="text-gray-600 ml-1 mr-4">{recipe.cookTime}</Text>
              <View className="bg-green-100 rounded-lg px-3 py-1">
                <Text className="text-green-600">{recipe.difficulty}</Text>
              </View>
            </View>

            {/* Nutrition Circle */}
            <View className="flex-row items-center mb-6">
              <View className="mr-4">
                <Text className="text-lg font-bold">{recipe.weight} gram</Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-4 h-2 bg-purple-500 rounded-full mr-1" />
                  <Text className="text-xs text-gray-600">{recipe.nutritionDetails?.carbs}g Karbohidrat</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <View className="w-4 h-2 bg-blue-500 rounded-full mr-1" />
                  <Text className="text-xs text-gray-600">{recipe.nutritionDetails?.protein}g Protein</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <View className="w-4 h-2 bg-orange-500 rounded-full mr-1" />
                  <Text className="text-xs text-gray-600">{recipe.nutritionDetails?.fat}g Lemak</Text>
                </View>
                <View className="flex-row items-center mt-1">
                  <View className="w-4 h-2 bg-green-500 rounded-full mr-1" />
                  <Text className="text-xs text-gray-600">{recipe.nutritionDetails?.fiber}g Serat</Text>
                </View>
              </View>

              <View className="w-24 h-24 rounded-full border-8 border-orange-500 items-center justify-center">
                <Text className="text-2xl font-bold">{recipe.calories}</Text>
                <Text className="text-xs">kkal</Text>
              </View>
            </View>

            {/* Tabs */}
            <View className="flex-row mb-4 border-b border-gray-200">
              <TouchableOpacity
                className={`py-2 px-4 ${activeTab === "Bahan-bahan" ? "border-b-2 border-green-500" : ""}`}
                onPress={() => onTabChange("Bahan-bahan")}
              >
                <Text className={activeTab === "Bahan-bahan" ? "text-green-500 font-bold" : "text-gray-500"}>
                  Bahan-bahan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 px-4 ${activeTab === "Cara Membuat" ? "border-b-2 border-green-500" : ""}`}
                onPress={() => onTabChange("Cara Membuat")}
              >
                <Text className={activeTab === "Cara Membuat" ? "text-green-500 font-bold" : "text-gray-500"}>
                  Cara Membuat
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === "Bahan-bahan" && (
              <View>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ingredient: string, index: number) => (
                    <View key={index} className="flex-row items-center mb-2">
                      <Text className="text-sm">• {ingredient}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 italic">Tidak ada bahan yang tersedia.</Text>
                )}
              </View>
            )}

            {activeTab === "Cara Membuat" && (
              <View>
                {recipe.steps && recipe.steps.length > 0 ? (
                  recipe.steps.map((step: string, index: number) => (
                    <View key={index} className="mb-3">
                      <Text className="text-sm">{step}</Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-500 italic">Cara membuat akan segera hadir!</Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
