import type React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import type { Recipe } from "../../utils/foodtypes"

interface RecipeRecommendationsScreenProps {
  recipes: Recipe[]
  onBack: () => void
  onRecipeSelect: (recipe: Recipe) => void
}

export const RecipeRecommendationsScreen: React.FC<RecipeRecommendationsScreenProps> = ({
  recipes,
  onBack,
  onRecipeSelect,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-white">
        <View className="p-4 flex-row items-center">
          <TouchableOpacity onPress={onBack} className="mr-2">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">ResepKu</Text>
          <View className="flex-1 items-end">
            <Ionicons name="ellipsis-vertical" size={24} color="#000" />
          </View>
        </View>

        <ScrollView className="flex-1">
          <View className="bg-gray-50 p-4 mx-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-semibold">Rekomendasi resep yang cocok</Text>
              <TouchableOpacity>
                <Text className="text-green-500">Segarkan</Text>
              </TouchableOpacity>
            </View>

            {recipes.slice(0, 5).map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                className="flex-row items-center py-3 border-b border-gray-200"
                onPress={() => onRecipeSelect(recipe)}
              >
                <Image
                  source={require("../../assets/LoadingImg.png")}
                  className="w-16 h-16 rounded-lg mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="font-bold">{recipe.name}</Text>
                  <View className="flex-row mt-1">
                    <View className="bg-red-100 rounded-lg px-3 py-1 mr-2">
                      <Text className="text-orange-500">{recipe.calories} kkal</Text>
                    </View>
                    <View className="bg-green-100 rounded-lg px-3 py-1">
                      <Text className="text-green-500">{recipe.weight}g</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity className="p-2">
                  <Ionicons name="bookmark-outline" size={24} color="#10B981" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mx-4 mb-4">
            <View className="bg-white rounded-full flex-row items-center px-4 py-3 shadow-sm border border-gray-200">
              <Ionicons name="search" size={20} color="gray" />
              <Text className="ml-2 flex-1 text-gray-400">Temukan Resep lainnya</Text>
            </View>
          </View>

          {recipes.slice(5, 7).map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              className="flex-row items-center py-3 px-4 border-b border-gray-200"
              onPress={() => onRecipeSelect(recipe)}
            >
              <Image
                source={require("../../assets/LoadingImg.png")}
                className="w-16 h-16 rounded-lg mr-3"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="font-bold">{recipe.name}</Text>
                <View className="flex-row mt-1">
                  <View className="bg-red-100 rounded-lg px-3 py-1 mr-2">
                    <Text className="text-orange-500">{recipe.calories} kkal</Text>
                  </View>
                  <View className="bg-green-100 rounded-lg px-3 py-1">
                    <Text className="text-green-500">{recipe.weight}g</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity className="p-2">
                <Ionicons name="bookmark-outline" size={24} color="#10B981" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="mx-4 my-6 border border-green-500 rounded-lg py-4 items-center flex-row justify-center"
            onPress={onBack}
          >
            <MaterialCommunityIcons name="camera" size={20} color="#10B981" />
            <Text className="text-green-500 font-bold ml-2">Kembali ke NutriLens</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
