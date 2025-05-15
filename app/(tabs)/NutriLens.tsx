"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { FoodItem } from "../../utils/foodtypes"
import FoodHistoryItem from "../../components/foodhistory/foodhistoryitem"
import { requestCameraPermission, takePicture } from "../../services/nutricameraservice"
import {
  analyzeFoodImage,
  analyzeIngredientsImage,
  getRecipeRecommendations,
  saveFoodHistory,
  saveRecipeToUserHistory,
} from "../../services/api-nutrilens"
import { type Recipe, defaultRecipeData } from "../../utils/foodtypes"
import { useSpinAnimation } from "../../hooks/use-spin-animation"
import { useModalAnimation } from "../../hooks/use-modal-animation"
import { AddItemModal } from "../../app/nutrilens/add-item-modal"
import { SuccessModal } from "../../app/nutrilens/success-modal"
import { FindingRecipesModal } from "../../app/nutrilens/finding-recipes-modal"
import { MealSelector } from "../../app/nutrilens/meal-selector"
import { FoodAnalysisScreen } from "../../app/nutrilens/food-analysis-screen"
import { RecipeRecommendationsScreen } from "../../app/nutrilens/recipe-recommendations-screen"
import { RecipeDetailScreen } from "../../app/nutrilens/recipe-detail-screen"
import { ScanOptions } from "../../app/nutrilens/scan-options"

// Opsi untuk dropdown
const mealOptions = ["Sarapan", "Makan Siang", "Makan Malam"]

// Sample food history data
const sampleFoodHistory: FoodItem[] = [
  { id: "1", name: "Nasi Goreng", calories: 450, weight: 250, unit: "g" },
  { id: "2", name: "Ayam Bakar", calories: 300, weight: 150, unit: "g" },
  { id: "3", name: "Sayur Asem", calories: 120, weight: 200, unit: "g" },
]

// Sample recipe history data
const sampleRecipeHistory: Recipe[] = [
  {
    id: "101",
    name: "Nasi Goreng Spesial",
    calories: 550,
    weight: 300,
    unit: "g",
    nutritionDetails: {
      carbs: 70,
      protein: 20,
      fat: 15,
      fiber: 5,
    },
    ingredients: ["Nasi", "Telur", "Bawang", "Kecap", "Cabai"],
    cookTime: "15 menit",
    difficulty: "Mudah",
    steps: ["Tumis bumbu", "Masukkan nasi", "Aduk rata", "Sajikan"],
  },
  {
    id: "102",
    name: "Ayam Goreng Crispy",
    calories: 450,
    weight: 200,
    unit: "g",
    nutritionDetails: {
      carbs: 30,
      protein: 40,
      fat: 25,
      fiber: 2,
    },
    ingredients: ["Ayam", "Tepung", "Bawang Putih", "Garam", "Merica"],
    cookTime: "30 menit",
    difficulty: "Sedang",
    steps: ["Marinasi ayam", "Balur tepung", "Goreng hingga keemasan", "Sajikan"],
  },
]

export default function NutriLensScreen() {
  const [selectedMeal, setSelectedMeal] = useState("Sarapan")
  const [showMealOptions, setShowMealOptions] = useState(false)
  const [activeTab, setActiveTab] = useState("NutriKu")
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>(sampleFoodHistory)
  const [searchText, setSearchText] = useState("")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [recognizedFoods, setRecognizedFoods] = useState<FoodItem[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showDetailFields, setShowDetailFields] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemPortion, setNewItemPortion] = useState("")
  const [newItemCalories, setNewItemCalories] = useState("")
  const [newItemCarbs, setNewItemCarbs] = useState("")
  const [newItemProtein, setNewItemProtein] = useState("")
  const [newItemFat, setNewItemFat] = useState("")
  const [newItemFiber, setNewItemFiber] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showSaveRecipeSuccess, setShowSaveRecipeSuccess] = useState(false)
  const [showCameraScreen, setShowCameraScreen] = useState(false)
  const navigation = useNavigation()
  const [recognizedIngredients, setRecognizedIngredients] = useState<FoodItem[]>([])
  const [ingredientsAnalysisComplete, setIngredientsAnalysisComplete] = useState(false)
  const [findingRecipes, setFindingRecipes] = useState(false)
  const [recipeRecommendations, setRecipeRecommendations] = useState<Recipe[]>([])
  const [showRecipeRecommendations, setShowRecipeRecommendations] = useState(false)
  const [recipeHistory, setRecipeHistory] = useState<Recipe[]>(sampleRecipeHistory)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showRecipeDetail, setShowRecipeDetail] = useState(false)
  const [activeRecipeTab, setActiveRecipeTab] = useState("Bahan-bahan")
  const [suggestedFoods, setSuggestedFoods] = useState<FoodItem[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { spinAnimation } = useSpinAnimation(loading || findingRecipes)
  const { modalAnimation } = useModalAnimation(showAddItemModal)

  // Load data from backend on component mount
  useEffect(() => {
    ;(async () => {
      try {
        setIsConnecting(true)

        // Request camera permission
        const granted = await requestCameraPermission()
        setHasPermission(granted)

        // Set suggested foods (this could be from backend or local)
        setSuggestedFoods([
          { id: "5", name: "Nasi Putih", calories: 350, weight: 200, unit: "g" },
          { id: "6", name: "Telur Mata Sapi", calories: 90, weight: 44, unit: "g" },
          { id: "7", name: "Udang", calories: 30, weight: 30, unit: "g" },
        ])

        setIsConnecting(false)
      } catch (error) {
        console.error("Error initializing app:", error)
        setErrorMessage("Gagal terhubung ke server. Silakan coba lagi nanti.")
        setIsConnecting(false)
      }
    })()
  }, [])

  // Function to handle taking a food picture and analyzing it
  const handleTakeFoodPicture = async () => {
    try {
      setShowCameraScreen(true)
      const uri = await takePicture()

      if (uri) {
        setImageUri(uri)
        setLoading(true)
        setAnalysisComplete(false)
        setRecognizedFoods([])
        setShowCameraScreen(false)

        // Call backend API to analyze food
        const foods = await analyzeFoodImage(uri)

        // Check if foods is undefined or null and provide a default empty array
        setRecognizedFoods(foods || [])
        setLoading(false)
        setAnalysisComplete(true)
      } else {
        setShowCameraScreen(false)
      }
    } catch (error) {
      console.error("Error taking/analyzing food picture:", error)
      setLoading(false)
      setShowCameraScreen(false)
      setRecognizedFoods([]) // Ensure recognizedFoods is always an array
      Alert.alert("Error", "Gagal menganalisis gambar makanan. Silakan coba lagi.")
    }
  }

  // Function to handle taking an ingredients picture and analyzing it
  const handleTakeIngredientsPicture = async () => {
    try {
      // Reset states
      setRecognizedIngredients([])
      setIngredientsAnalysisComplete(false)
      setShowRecipeRecommendations(false)

      setShowCameraScreen(true)
      const uri = await takePicture()

      if (uri) {
        setImageUri(uri)
        setLoading(true)
        setShowCameraScreen(false)

        // Call backend API to analyze ingredients
        const ingredients = await analyzeIngredientsImage(uri)

        // Check if ingredients is undefined or null and provide a default empty array
        setRecognizedIngredients(ingredients || [])
        setLoading(false)
        setIngredientsAnalysisComplete(true)
      } else {
        setShowCameraScreen(false)
      }
    } catch (error) {
      console.error("Error taking/analyzing ingredients picture:", error)
      setLoading(false)
      setShowCameraScreen(false)
      setRecognizedIngredients([]) // Ensure recognizedIngredients is always an array
      Alert.alert("Error", "Gagal menganalisis gambar bahan. Silakan coba lagi.")
    }
  }

  // Function to navigate to recipe detail
  const navigateToRecipeDetail = (recipe: Recipe) => {
    try {
      // Make sure recipe has all required properties
      if (!recipe || !recipe.id || !recipe.name) {
        console.error("Invalid recipe object:", recipe)
        return
      }

      // Instead of using navigation, set the selected recipe and show the detail screen
      setSelectedRecipe(recipe)
      setShowRecipeDetail(true)
    } catch (error) {
      console.error("Navigation error:", error)
      Alert.alert("Error", "Gagal membuka detail resep.")
    }
  }

  // Function to save recipe to history - FIXED to handle a single Recipe object
  const saveRecipeToHistory = async (recipe: Recipe) => {
    try {
      // Add default values for properties that might be missing
      const completeRecipe: Recipe = {
        id: recipe.id || Date.now().toString(),
        name: recipe.name || "Roti Lapis Alpukat",
        calories: recipe.calories || 300,
        weight: recipe.weight || 380,
        unit: recipe.unit || "g",
        image: recipe.image || "../../assets/LoadingImg.png",
        nutritionDetails: recipe.nutritionDetails || defaultRecipeData.nutritionDetails,
        ingredients: recipe.ingredients || defaultRecipeData.ingredients,
        cookTime: recipe.cookTime || defaultRecipeData.cookTime,
        difficulty: recipe.difficulty || defaultRecipeData.difficulty,
        steps: recipe.steps || [],
      }

      console.log("Saving recipe to history:", completeRecipe.name)

      const exists = recipeHistory.some((item) => item.id === completeRecipe.id)
      if (!exists) {
        
        setRecipeHistory([completeRecipe, ...recipeHistory])
        setShowSaveRecipeSuccess(true)
        setTimeout(() => {
          setShowSaveRecipeSuccess(false)
        }, 2000)

        saveRecipeToUserHistory([completeRecipe as unknown as FoodItem]).catch((error) => {
        console.error("Error saving to backend:", error)
        })
      } else {
        Alert.alert("Info", "Resep ini sudah ada di riwayat.")
      }
    } catch (error) {
      console.error("Error saving recipe to history:", error)
      Alert.alert("Error", "Gagal menyimpan resep ke riwayat.")
    }
  }

  // Function to find recipes based on ingredients
  const handleFindRecipes = async () => {
    try {
      setFindingRecipes(true)
      console.log("Finding recipes for ingredients:", recognizedIngredients)

      // Call backend API to get recipe recommendations
      const recipes = await getRecipeRecommendations(recognizedIngredients)
      console.log("Received recipe recommendations:", recipes ? recipes.length : 0)

      setFindingRecipes(false)

      if (!recipes || recipes.length === 0) {
        console.warn("No recipes found or empty recipes array returned")
        Alert.alert("Info", "Tidak ditemukan resep yang cocok dengan bahan-bahan ini. Silakan coba bahan lain.")
        return
      }

      // Log the first recipe to help with debugging
      if (recipes.length > 0) {
        console.log("First recipe:", JSON.stringify(recipes[0], null, 2))
      }

      setRecipeRecommendations(recipes)
      setShowRecipeRecommendations(true)

      // Removed automatic saving of first recipe
    } catch (error) {
      console.error("Error finding recipes:", error)
      setFindingRecipes(false)
      Alert.alert("Error", "Gagal mendapatkan rekomendasi resep. Silakan coba lagi.")
    }
  }

  // Function to handle retaking a picture
  const handleRetake = async () => {
    try {
      // Reset states before taking a new picture
      setLoading(false)
      setAnalysisComplete(false)
      setRecognizedFoods([])

      setShowCameraScreen(true)
      const uri = await takePicture()

      if (uri) {
        setImageUri(uri)
        setLoading(true)
        setShowCameraScreen(false)

        // Call backend API to analyze food
        const foods = await analyzeFoodImage(uri)

        // Check if foods is undefined or null and provide a default empty array
        setRecognizedFoods(foods || [])
        setLoading(false)
        setAnalysisComplete(true)
      } else {
        setShowCameraScreen(false)
      }
    } catch (error) {
      console.error("Error retaking picture:", error)
      setLoading(false)
      setShowCameraScreen(false)
      setRecognizedFoods([]) // Ensure recognizedFoods is always an array
      Alert.alert("Error", "Gagal menganalisis gambar. Silakan coba lagi.")
    }
  }

  // Function to save food to history
  const handleSaveFood = async () => {
    try {
      // Check if there are foods to save
      if (!recognizedFoods || recognizedFoods.length === 0) {
        Alert.alert("Error", "Tidak ada makanan untuk disimpan.")
        return
      }

      console.log("Attempting to save foods:", recognizedFoods)
      console.log("Selected meal:", selectedMeal)

      // Save to backend
      const success = await saveFoodHistory(recognizedFoods, selectedMeal)

      if (success) {
        // Show success modal
        setShowSuccessModal(true)

        // Update local state and reset after 2 seconds
        setTimeout(() => {
          setFoodHistory([...foodHistory, ...recognizedFoods])
          setShowSuccessModal(false)
          setImageUri(null)
          setRecognizedFoods([])
          setAnalysisComplete(false)
        }, 2000)
      } else {
        Alert.alert("Error", "Gagal menyimpan makanan ke riwayat. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("Error saving food:", error)
      Alert.alert("Error", "Gagal menyimpan makanan ke riwayat. Silakan coba lagi.")
    }
  }

  // Function to remove food from recognized foods
  const handleRemoveFood = (id: string) => {
    setRecognizedFoods(recognizedFoods.filter((food) => food.id !== id))
  }

  // Function to handle adding a new item
  const handleAddItemClick = () => {
    setShowAddItemModal(true)
    resetNewItemFields()
  }

  // Function to close modal
  const handleCloseModal = () => {
    setShowAddItemModal(false)
    setShowDetailFields(false)
    resetNewItemFields()
  }

  // Function to reset new item fields
  const resetNewItemFields = () => {
    setNewItemName("")
    setNewItemPortion("")
    setNewItemCalories("")
    setNewItemCarbs("")
    setNewItemProtein("")
    setNewItemFat("")
    setNewItemFiber("")
  }

  // Function to handle search click
  const handleSearchClick = () => {
    setShowDetailFields(true)
    Keyboard.dismiss()
  }

  // Function to save new item
  const handleSaveNewItem = () => {
    if (newItemName.trim() === "") {
      // Validate item name is not empty
      Alert.alert("Error", "Nama item tidak boleh kosong")
      return
    }

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: newItemName,
      calories: Number.parseInt(newItemCalories) || 0,
      weight: Number.parseInt(newItemPortion) || 0,
      unit: "g",
    }

    setRecognizedFoods([...recognizedFoods, newFood])
    handleCloseModal()
  }

  // Function to remove ingredient
  const handleRemoveIngredient = (id: string) => {
    setRecognizedIngredients(recognizedIngredients.filter((ingredient) => ingredient.id !== id))
  }

  // Function to save new ingredient
  const handleSaveNewIngredient = () => {
    if (newItemName.trim() === "") {
      // Validate item name is not empty
      Alert.alert("Error", "Nama item tidak boleh kosong")
      return
    }

    const newIngredient: FoodItem = {
      id: Date.now().toString(),
      name: newItemName,
      calories: Number.parseInt(newItemCalories) || 0,
      weight: Number.parseInt(newItemPortion) || 0,
      unit: "g",
    }

    setRecognizedIngredients([...recognizedIngredients, newIngredient])
    handleCloseModal()
  }

  // Function to go back to NutriLens
  const handleBackToNutriLens = () => {
    setShowRecipeRecommendations(false)
    setImageUri(null)
    setRecognizedIngredients([])
    setIngredientsAnalysisComplete(false)
  }

  // Function to go back from recipe detail
  const handleBackFromRecipeDetail = () => {
    setShowRecipeDetail(false)
    setSelectedRecipe(null)
    setActiveRecipeTab("Bahan-bahan")
  }

  // Function to save recipe and go back
  const handleSaveRecipe = async () => {
    if (selectedRecipe) {
      try {
        // Save to history
        await saveRecipeToHistory(selectedRecipe)

        // Reset UI
        handleBackFromRecipeDetail()
        setShowRecipeRecommendations(false)
        setImageUri(null)
      } catch (error) {
        console.error("Error saving recipe:", error)
        Alert.alert("Error", "Gagal menyimpan resep. Silakan coba lagi.")
      }
    }
  }

  // Function to add food to history
  const addFoodToHistory = async (food: FoodItem) => {
    try {
      // Create a new food object with unique ID
      const newFood = { ...food, id: Date.now().toString() }

      // Save to backend
      const success = await saveFoodHistory([newFood], selectedMeal)

      if (success) {
        // Update local state
        setFoodHistory([...foodHistory, newFood])
        Alert.alert("Sukses", "Makanan berhasil ditambahkan ke riwayat.")
      } else {
        Alert.alert("Error", "Gagal menambahkan makanan ke riwayat.")
      }
    } catch (error) {
      console.error("Error adding food:", error)
      Alert.alert("Error", "Gagal menambahkan makanan ke riwayat.")
    }
  }

  // Function to handle bookmark click in recipe history
  const handleBookmarkClick = (recipe: Recipe) => {
    saveRecipeToHistory(recipe)
  }

  // Function to handle meal selection
  const selectMeal = (meal: string) => {
    setSelectedMeal(meal)
    setShowMealOptions(false)
  }

  // Show loading indicator while connecting to backend
  if (isConnecting) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
        <Text className="mt-4">Menghubungkan ke server...</Text>
      </SafeAreaView>
    )
  }

  // Show error message if connection failed
  if (errorMessage) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-4">
        <Ionicons name="alert-circle" size={48} color="#FF5733" />
        <Text className="text-center mt-4 mb-8">{errorMessage}</Text>
        <TouchableOpacity className="bg-orange-500 px-6 py-3 rounded-lg" onPress={() => setErrorMessage(null)}>
          <Text className="text-white font-bold">Coba Lagi</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Meminta izin kamera...</Text>
      </SafeAreaView>
    )
  }

  // Recipe Detail Screen
  if (showRecipeDetail && selectedRecipe) {
    return (
      <RecipeDetailScreen
        recipe={selectedRecipe}
        activeTab={activeRecipeTab}
        onTabChange={setActiveRecipeTab}
        onBack={handleBackFromRecipeDetail}
        onSave={handleSaveRecipe}
      />
    )
  }

  // Tampilan analisis makanan
  if (imageUri) {
    // If we're showing recipe recommendations
    if (showRecipeRecommendations) {
      return (
        <RecipeRecommendationsScreen
          recipes={recipeRecommendations}
          onBack={handleBackToNutriLens}
          onRecipeSelect={navigateToRecipeDetail}
          onSaveRecipe={saveRecipeToHistory}
        />
      )
    }

    return (
      <FoodAnalysisScreen
        imageUri={imageUri}
        loading={loading}
        activeTab={activeTab}
        spinAnimation={spinAnimation}
        analysisComplete={analysisComplete}
        ingredientsAnalysisComplete={ingredientsAnalysisComplete}
        recognizedFoods={recognizedFoods}
        recognizedIngredients={recognizedIngredients}
        selectedMeal={selectedMeal}
        showMealOptions={showMealOptions}
        onMealSelect={selectMeal}
        onRemoveFood={handleRemoveFood}
        onRemoveIngredient={handleRemoveIngredient}
        onAddItemClick={handleAddItemClick}
        onRetake={handleRetake}
        onTakeIngredientsPicture={handleTakeIngredientsPicture}
        onSaveFood={handleSaveFood}
        onFindRecipes={handleFindRecipes}
        onBack={() => {
          setImageUri(null)
          setRecognizedFoods([])
          setRecognizedIngredients([])
          setAnalysisComplete(false)
          setIngredientsAnalysisComplete(false)
        }}
      />
    )
  }

  // Tampilan utama
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 bg-gray-100 px-3">
        <ScrollView className="flex-1 ">
          <View className="bg-white p-3 rounded-2xl mb-3 ">
          {/* Meal Selector Dropdown */}
          <MealSelector
            selectedMeal={selectedMeal}
            showOptions={showMealOptions}
            options={mealOptions}
            onToggleOptions={() => setShowMealOptions(!showMealOptions)}
            onSelectMeal={selectMeal}
          />

          {/* Scan Options */}
          <ScanOptions
            onScanFood={() => {
              setActiveTab("NutriKu")
              handleTakeFoodPicture()
            }}
            onScanIngredients={() => {
              setActiveTab("ResepKu")
              handleTakeIngredientsPicture()
            }}
          />
          </View> 

          {/* Search Bar */}
          <View className="bg-white rounded-full flex-row items-center px-4 py-1 mb-7 shadow-sm border border-gray-200">
            <Ionicons name="search" size={20} color="gray" />
            <TextInput
              className="ml-2 flex-1"
              placeholder="Temukan makanan"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Tabs */}
          <View className="bg-white px-4 pt-4 rounded-t-2xl ">
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 ${
                activeTab === "NutriKu" ? "bg-orange-500" : "bg-white"
              } rounded-l-3xl rounded-r-3xl items-center`}
              onPress={() => setActiveTab("NutriKu")}
            >
              <Text className={activeTab === "NutriKu" ? "text-white font-bold" : "text-gray-500"}>NutriKu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 ${
                activeTab === "ResepKu" ? "bg-green-500" : "bg-white"
              } rounded-r-3xl rounded-l-3xl items-center`}
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

                {foodHistory.length > 0 ? (
                  foodHistory.map((food) => <FoodHistoryItem key={food.id} food={food} />)
                ) : (
                  <View className="items-center justify-center py-10 bg-gray-50 rounded-lg">
                    <Text className="text-gray-500">
                      Belum ada riwayat makanan. Scan makanan untuk menambahkan ke riwayat.
                    </Text>
                  </View>
                )}
              </View>

              {/* Suggestions */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Saran</Text>
                <Text className="text-sm text-gray-600 mb-4">Berikut asupan yang mungkin kamu konsumsi.</Text>

                {suggestedFoods.map((food) => (
                  <FoodHistoryItem key={food.id} food={food} showAddButton onAddPress={() => addFoodToHistory(food)} />
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Recipe History */}
              <View className="mb-6 pb-20">
                <Text className="text-lg font-bold mb-2">Riwayat</Text>
                <Text className="text-sm text-gray-600 mb-4">Berikut resep yang pernah kamu rekam.</Text>

                {recipeHistory.length > 0 ? (
                  <View className="border border-gray-200 rounded-lg overflow-hidden">
                    {recipeHistory.map((recipe) => (
                      <TouchableOpacity
                        key={recipe.id}
                        className="flex-row items-center p-3 border-b border-gray-200"
                        onPress={() => navigateToRecipeDetail(recipe)}
                      >
                        <Image
                          source={require("../../assets/LoadingImg.png")}
                          className="w-12 h-12 rounded-lg mr-3"
                          resizeMode="cover"
                        />
                        <View className="flex-1">
                          <Text className="font-bold">{recipe.name}</Text>
                          <View className="flex-row mt-1">
                            <View className="bg-red-100 rounded-lg px-2 py-1 mr-2">
                              <Text className="text-orange-500 text-xs">{recipe.calories} kkal</Text>
                            </View>
                            <View className="bg-green-100 rounded-lg px-2 py-1">
                              <Text className="text-green-500 text-xs">{recipe.weight}g</Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity className="p-2" onPress={() => handleBookmarkClick(recipe)}>
                          <Ionicons name="bookmark-outline" size={24} color="#10B981" />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <View className="items-center justify-center py-10 bg-gray-50 rounded-lg">
                    <Text className="text-gray-500">
                      Belum ada riwayat resep. Scan bahan-bahan untuk mendapatkan rekomendasi resep.
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
          </View>
          {/* Success Message */}
          {showSuccessModal && (
            <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#FF5733" className="mr-2" />
              <Text className="text-orange-500">Nama Item berhasil ditambahkan ke NuTracker</Text>
            </View>
          )}

          {/* Recipe Save Success Message */}
          {showSaveRecipeSuccess && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-4 flex-row items-center mb-4">
              <Ionicons name="bookmark" size={24} color="#10B981" className="mr-2" />
              <Text className="text-green-500">Resep berhasil disimpan ke riwayat</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Modals */}
      <AddItemModal
        visible={showAddItemModal}
        modalAnimation={modalAnimation}
        showDetailFields={showDetailFields}
        newItemName={newItemName}
        newItemPortion={newItemPortion}
        newItemCalories={newItemCalories}
        newItemCarbs={newItemCarbs}
        newItemProtein={newItemProtein}
        newItemFat={newItemFat}
        newItemFiber={newItemFiber}
        activeTab={activeTab}
        onClose={handleCloseModal}
        onNameChange={setNewItemName}
        onPortionChange={setNewItemPortion}
        onCaloriesChange={setNewItemCalories}
        onCarbsChange={setNewItemCarbs}
        onProteinChange={setNewItemProtein}
        onFatChange={setNewItemFat}
        onFiberChange={setNewItemFiber}
        onSearch={handleSearchClick}
        onSave={activeTab === "NutriKu" ? handleSaveNewItem : handleSaveNewIngredient}
      />

      <SuccessModal visible={showSuccessModal} />

      <FindingRecipesModal visible={findingRecipes} spinAnimation={spinAnimation} />
    </SafeAreaView>
  )
}
