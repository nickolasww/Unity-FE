import type React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { FoodItem } from "../../utils/foodtypes"
import { MealSelector } from "../../app/nutrilens/meal-selector"

interface FoodAnalysisScreenProps {
  imageUri: string
  loading: boolean
  activeTab: string
  spinAnimation: Animated.Value
  analysisComplete: boolean
  ingredientsAnalysisComplete: boolean
  recognizedFoods: FoodItem[]
  recognizedIngredients: FoodItem[]
  selectedMeal: string
  showMealOptions: boolean
  onMealSelect: (meal: string) => void
  onRemoveFood: (id: string) => void
  onRemoveIngredient: (id: string) => void
  onAddItemClick: () => void
  onRetake: () => void
  onTakeIngredientsPicture: () => void
  onSaveFood: () => void
  onFindRecipes: () => void
  onBack: () => void
}

export const FoodAnalysisScreen: React.FC<FoodAnalysisScreenProps> = ({
  imageUri,
  loading,
  activeTab,
  spinAnimation,
  analysisComplete,
  ingredientsAnalysisComplete,
  recognizedFoods,
  recognizedIngredients,
  selectedMeal,
  showMealOptions,
  onMealSelect,
  onRemoveFood,
  onRemoveIngredient,
  onAddItemClick,
  onRetake,
  onTakeIngredientsPicture,
  onSaveFood,
  onFindRecipes,
  onBack,
}) => {
  const mealOptions = ["Sarapan", "Makan Siang", "Makan Malam"]

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-white">
        {loading ? (
          // Loading screen - menampilkan gambar dengan overlay loading
          <View className="flex-1">
            <View className="p-4">
              <Text className="text-center text-gray-600 mb-4">
                Cukup arahkan kamera ke {activeTab === "NutriKu" ? "makananmu" : "bahan-bahanmu"}, lalu tekan tombol
                untuk melihat {activeTab === "NutriKu" ? "nutrisinya" : "resep yang cocok"}.
              </Text>
            </View>

            <View className="items-center justify-center px-4">
              <View className="relative w-full aspect-square max-w-sm rounded-lg overflow-hidden">
                <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute inset-0 items-center justify-center">
                  <View className="bg-white p-4 rounded-lg w-4/5 items-center">
                    <View className="mb-2">
                      <View className="w-6 h-6 items-center justify-center">
                        <View className="w-6 h-6 absolute">
                          <Animated.View
                            style={{
                              transform: [
                                {
                                  rotate: spinAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"],
                                  }),
                                },
                              ],
                            }}
                          >
                            <Image
                              source={require("../../assets/LoadingImg.png")}
                              className="w-6 h-6"
                              resizeMode="contain"
                            />
                          </Animated.View>
                        </View>
                      </View>
                    </View>
                    <Text className="text-center">Tunggu sebentar, NutriLens sedang menganalisis gambar</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Hasil analisis - dengan thumbnail gambar
          <ScrollView className="flex-1 p-4">
            {/* Header with back button */}
            <View className="flex-row items-center mb-4">
              <TouchableOpacity onPress={onBack} className="mr-2">
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text className="text-xl font-bold">{activeTab}</Text>
              <View className="flex-1 items-end">
                <Ionicons name="ellipsis-vertical" size={24} color="#000" />
              </View>
            </View>

            {(analysisComplete || ingredientsAnalysisComplete) && (
              <>
                <View className="bg-orange-50 p-4 rounded-lg mb-6 flex-row items-center">
                  <View className="flex-row items-center flex-1">
                    <View className="mr-3">
                      <Image source={{ uri: imageUri }} className="w-12 h-12 rounded-lg" resizeMode="cover" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Ionicons name="checkmark-circle" size={20} color="#FF5733" className="mr-1" />
                        <Text className="text-green-500 font-bold ml-1">
                          {activeTab === "NutriKu" ? "Makanan" : "Gambar"} selesai dianalisis
                        </Text>
                      </View>
                      <Text className="text-gray-700 text-xs">
                        {activeTab === "NutriKu"
                          ? "Berikut item dan kandungan nutrisi makananmu. Jika ada yang terlewat, silahkan tambahkan manual."
                          : "Berikut bahan-bahan yang terdeteksi. Jika ada yang terlewat, silahkan tambahkan manual."}
                      </Text>
                    </View>
                  </View>
                </View>

                {activeTab === "NutriKu" && analysisComplete && (
                  <>
                    <MealSelector
                      selectedMeal={selectedMeal}
                      showOptions={showMealOptions}
                      options={mealOptions}
                      onToggleOptions={() => {}}
                      onSelectMeal={onMealSelect}
                    />

                    {recognizedFoods.map((food) => (
                      <View
                        key={food.id}
                        className="border-b border-gray-200 py-4 flex-row justify-between items-center"
                      >
                        <View>
                          <Text className="font-bold text-lg">{food.name}</Text>
                          <View className="flex-row mt-1">
                            <View className="bg-red-100 rounded-lg px-3 py-1 mr-2">
                              <Text className="text-orange-500">{food.calories} kkal</Text>
                            </View>
                            <View className="bg-green-100 rounded-lg px-3 py-1">
                              <Text className="text-green-500">
                                {food.weight}
                                {food.unit}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => onRemoveFood(food.id)}>
                          <Ionicons name="trash-outline" size={24} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
                )}

                {activeTab === "ResepKu" && ingredientsAnalysisComplete && (
                  <>
                    {recognizedIngredients.map((ingredient) => (
                      <View
                        key={ingredient.id}
                        className="border-b border-gray-200 py-4 flex-row justify-between items-center"
                      >
                        <View>
                          <Text className="font-bold text-lg">{ingredient.name}</Text>
                          <View className="flex-row mt-1">
                            <View className="bg-red-100 rounded-lg px-3 py-1 mr-2">
                              <Text className="text-orange-500">{ingredient.calories} kkal</Text>
                            </View>
                            <View className="bg-green-100 rounded-lg px-3 py-1">
                              <Text className="text-green-500">
                                {ingredient.weight}
                                {ingredient.unit}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity onPress={() => onRemoveIngredient(ingredient.id)}>
                          <Ionicons name="trash-outline" size={24} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </>
                )}

                <TouchableOpacity className="flex-row items-center justify-end mt-6 mb-4" onPress={onAddItemClick}>
                  <Ionicons name="add-circle" size={20} color="#fe572f" />
                  <Text className="color-[#fe572f] font-bold ml-2">Tambah Item</Text>
                </TouchableOpacity>

                <View className="flex-row mt-8 mb-4">
                  <TouchableOpacity
                    className="flex-1 border border-[#fe572f] rounded-lg py-4 items-center justify-center mr-2"
                    onPress={activeTab === "NutriKu" ? onRetake : onTakeIngredientsPicture}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="camera" size={20} color="#fe572f" />
                      <Text className="text-orange-500 font-bold ml-2">NutriLens</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-orange-500 rounded-lg py-4 items-center justify-center ml-2"
                    onPress={activeTab === "NutriKu" ? onSaveFood : onFindRecipes}
                  >
                    <Text className="text-white font-bold">
                      {activeTab === "NutriKu" ? "Simpan ke NuTracker" : "Temukan Resep"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  )
}
