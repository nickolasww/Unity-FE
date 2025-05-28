"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import type { FoodItem } from "../../utils/foodtypes"
import { MealSelector } from "../../app/nutrilens/meal-selector"
import SuccessModal from "./success-modal"
import FindingRecipesModal from "./finding-recipes-modal"
import { useDataRefresh } from "../../hooks/use-data-refresh"

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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isProcessingRecipes, setIsProcessingRecipes] = useState(false)
  const { saveRefreshFlag } = useDataRefresh()

  // Debug logging with more details
  console.log("FoodAnalysisScreen - recognizedFoods:", JSON.stringify(recognizedFoods, null, 2))
  console.log("FoodAnalysisScreen - recognizedIngredients:", JSON.stringify(recognizedIngredients, null, 2))
  console.log("FoodAnalysisScreen - analysisComplete:", analysisComplete)
  console.log("FoodAnalysisScreen - ingredientsAnalysisComplete:", ingredientsAnalysisComplete)
  console.log("FoodAnalysisScreen - showLoadingModal:", showLoadingModal)
  console.log("FoodAnalysisScreen - isProcessingRecipes:", isProcessingRecipes)

  // Check for analysis errors
  useEffect(() => {
    if (activeTab === "ResepKu" && ingredientsAnalysisComplete) {
      if (!recognizedIngredients || recognizedIngredients.length === 0) {
        setAnalysisError("Tidak ada bahan yang terdeteksi. Silakan coba lagi atau tambahkan secara manual.")
      } else {
        setAnalysisError(null)
      }
    } else if (activeTab === "NutriKu" && analysisComplete) {
      if (!recognizedFoods || recognizedFoods.length === 0) {
        setAnalysisError("Tidak ada makanan yang terdeteksi. Silakan coba lagi atau tambahkan secara manual.")
      } else {
        setAnalysisError(null)
      }
    }
  }, [activeTab, analysisComplete, ingredientsAnalysisComplete, recognizedFoods, recognizedIngredients])

  // Automatically hide loading modal if it's been showing for too long (timeout safety)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (showLoadingModal) {
      // Set a timeout to hide the modal after 30 seconds if it's still showing
      timeoutId = setTimeout(() => {
        console.log("Loading modal timeout triggered - hiding modal")
        setShowLoadingModal(false)
        setIsProcessingRecipes(false)

        // Show an error message to the user
        Alert.alert("Waktu Habis", "Pencarian resep memakan waktu terlalu lama. Silakan coba lagi.", [{ text: "OK" }])
      }, 30000) // 30 seconds timeout
    }

    // Clean up the timeout when the component unmounts or when showLoadingModal changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [showLoadingModal])

  const handleSaveFoodWithModal = async () => {
    try {
      if (!recognizedFoods || recognizedFoods.length === 0) {
        Alert.alert("Info", "Tidak ada makanan yang terdeteksi. Silakan tambahkan makanan terlebih dahulu.")
        return
      }

      setShowSuccessModal(true)

      try {
        await onSaveFood()
        // Set refresh flag setelah berhasil menyimpan
        await saveRefreshFlag()
      } catch (error) {
        console.error("Error in onSaveFood:", error)
        // We'll keep the modal visible for a moment even if there's an error
        // to avoid a jarring UX, then show an error message
      }

      // Modal will be closed by the parent component after the save is complete
      setTimeout(() => {
        setShowSuccessModal(false)
      }, 2000)
    } catch (error) {
      console.error("Error in handleSaveFoodWithModal:", error)
      setShowSuccessModal(false)
      Alert.alert("Error", "Terjadi kesalahan saat menyimpan makanan. Silakan coba lagi.")
    }
  }

  const handleFindRecipesWithModal = async () => {
    try {
      if (!recognizedIngredients || recognizedIngredients.length === 0) {
        Alert.alert("Info", "Tidak ada bahan yang terdeteksi. Silakan tambahkan bahan terlebih dahulu.")
        return
      }

      // Set flags to indicate we're processing
      setShowLoadingModal(true)
      setIsProcessingRecipes(true)

      console.log("Starting recipe search process...")

      try {
        // Call the onFindRecipes function passed from parent
        await onFindRecipes()

        // If we get here, the function completed but the modal might still be showing
        // This could happen if the navigation to recipe screen didn't happen
        console.log("onFindRecipes completed, checking if we need to hide modal...")
        setShowLoadingModal(false)
        setIsProcessingRecipes(false)

        // Small delay to allow navigation to happen
        setTimeout(() => {
          if (setShowLoadingModal) {
            // Check if component is still mounted
            console.log("Hiding loading modal after completion")
            setShowLoadingModal(false)
            setIsProcessingRecipes(false)
          }
        }, 500)
      } catch (error) {
        console.error("Error finding recipes:", error)
        setShowLoadingModal(false)
        setIsProcessingRecipes(false)
        Alert.alert("Error", "Terjadi kesalahan saat mencari resep. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error in handleFindRecipesWithModal:", error)
      setShowLoadingModal(false)
      setIsProcessingRecipes(false)
      Alert.alert("Error", "Terjadi kesalahan saat mencari resep. Silakan coba lagi.")
    }
  }

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
                        <Text className="text-green-500 font-bold ml-1">Gambar selesai dianalisis</Text>
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

                    {Array.isArray(recognizedFoods) && recognizedFoods.length > 0 ? (
                      recognizedFoods.map((food) => (
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
                      ))
                    ) : (
                      <View className="items-center justify-center py-10 bg-gray-50 rounded-lg my-4">
                        <Text className="text-gray-500">
                          {analysisError ||
                            "Tidak ada makanan yang terdeteksi. Silakan coba lagi atau tambahkan secara manual."}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {activeTab === "ResepKu" && ingredientsAnalysisComplete && (
                  <>
                    {Array.isArray(recognizedIngredients) && recognizedIngredients.length > 0 ? (
                      recognizedIngredients.map((ingredient) => (
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
                      ))
                    ) : (
                      <View className="items-center justify-center py-10 bg-gray-50 rounded-lg my-4">
                        <Text className="text-gray-500">
                          {analysisError ||
                            "Tidak ada bahan yang terdeteksi. Silakan coba lagi atau tambahkan secara manual."}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                <TouchableOpacity className="flex-row items-center justify-end mt-6 mb-4" onPress={onAddItemClick}>
                  <Ionicons name="add-circle" size={20} color="#fe572f" />
                  <Text className="text-[#fe572f] font-bold ml-2">Tambah Item</Text>
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
                    onPress={activeTab === "NutriKu" ? handleSaveFoodWithModal : handleFindRecipesWithModal}
                    disabled={isProcessingRecipes}
                  >
                    {isProcessingRecipes ? (
                      <View className="flex-row items-center">
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
                          <Ionicons name="refresh" size={20} color="white" />
                        </Animated.View>
                        <Text className="text-white font-bold ml-2">Mencari...</Text>
                      </View>
                    ) : (
                      <Text className="text-white font-bold">
                        {activeTab === "NutriKu" ? "Simpan ke NuTracker" : "Temukan Resep"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {/* Error Banner */}
        {analysisError && !loading && (
          <View className="absolute bottom-0 left-0 right-0 bg-red-500 p-3 flex-row items-center">
            <Ionicons name="alert-circle" size={24} color="white" />
            <Text className="text-white ml-2 flex-1">
              Error analyzing {activeTab === "NutriKu" ? "food" : "ingredients"} image
            </Text>
            <TouchableOpacity onPress={() => setAnalysisError(null)}>
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Success Modal for saving food */}
        <SuccessModal visible={showSuccessModal} />

        {/* Modal untuk menampilkan hasil temukan resep makanan */}
        <FindingRecipesModal visible={showLoadingModal} spinAnimation={spinAnimation} />
      </View>
    </SafeAreaView>
  )
}

export default FoodAnalysisScreen
