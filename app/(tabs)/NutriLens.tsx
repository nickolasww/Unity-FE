"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Modal,
  Keyboard,
  Easing,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import type { FoodItem } from "../../utils/foodtypes"
import FoodHistoryItem from "../../components/foodhistory/foodhistoryitem"
import { requestCameraPermission, takePicture } from "../../services/nutricameraservice"
import ResepKuDetail from "../nutrilens/resepkuDetail"

// Define Recipe interface for better type safety
interface Recipe {
  id: string;
  name: string;
  calories: number;
  weight: number;
  unit: string;
  image?: string;
  nutritionDetails?: {
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  };
  ingredients?: string[];
  cookTime?: string;
  difficulty?: string;
}

// Data dummy untuk riwayat makanan
const initialFoodHistory: FoodItem[] = [
  { id: "1", name: "Nasi Goreng", calories: 350, weight: 200, unit: "g" },
  { id: "2", name: "Telur Mata Sapi", calories: 90, weight: 44, unit: "g" },
  { id: "3", name: "Udang", calories: 30, weight: 30, unit: "g" },
  { id: "4", name: "Alpukat", calories: 350, weight: 200, unit: "g" },
]

// Data dummy untuk saran makanan
const suggestedFoods: FoodItem[] = [
  { id: "5", name: "Nasi Putih", calories: 350, weight: 200, unit: "g" },
  { id: "6", name: "Telur Mata Sapi", calories: 90, weight: 44, unit: "g" },
  { id: "7", name: "Udang", calories: 30, weight: 30, unit: "g" },
]

// Default recipe data for consistent recipe objects
const defaultRecipeData = {
  nutritionDetails: {
    carbs: 32,
    protein: 13,
    fat: 21,
    fiber: 7
  },
  ingredients: [
    "2 lembar roti gandum utuh",
    "1/2 buah alpukat matang",
    "6-8 buah tomat ceri, dibelah dua",
    "1 butir telur",
    "1 sdt minyak zaitun (untuk menggoreng telur)",
    "Garam dan lada secukupnya",
    "Perasan air lemon (opsional)"
  ],
  cookTime: "10 menit",
  difficulty: "Mudah"
};

// Data dummy untuk riwayat resep
const initialRecipeHistory: Recipe[] = [
  {
    id: "r1",
    name: "Roti Lapis Alpukat",
    calories: 300,
    weight: 380,
    unit: "g",
    image: "../../assets/LoadingImg.png",
    ...defaultRecipeData
  },
  {
    id: "r2",
    name: "Roti Lapis Alpukat",
    calories: 300,
    weight: 380,
    unit: "g",
    image: "../../assets/LoadingImg.png",
    ...defaultRecipeData
  },
  {
    id: "r3",
    name: "Roti Lapis Alpukat",
    calories: 300,
    weight: 380,
    unit: "g",
    image: "../../assets/LoadingImg.png",
    ...defaultRecipeData
  },
]

// Opsi untuk dropdown
const mealOptions = ["Sarapan", "Makan Siang", "Makan Malam"]

export default function NutriLensScreen() {
  const [selectedMeal, setSelectedMeal] = useState("Sarapan");
  const [showMealOptions, setShowMealOptions] = useState(false);
  const [activeTab, setActiveTab] = useState("NutriKu");
  const [foodHistory, setFoodHistory] = useState<FoodItem[]>(initialFoodHistory);
  const [searchText, setSearchText] = useState("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<FoodItem[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showDetailFields, setShowDetailFields] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPortion, setNewItemPortion] = useState("");
  const [newItemCalories, setNewItemCalories] = useState("");
  const [newItemCarbs, setNewItemCarbs] = useState("");
  const [newItemProtein, setNewItemProtein] = useState("");
  const [newItemFat, setNewItemFat] = useState("");
  const [newItemFiber, setNewItemFiber] = useState("");
  const [modalAnimation] = useState(new Animated.Value(0));
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCameraScreen, setShowCameraScreen] = useState(false);
  const [spinAnimation] = useState(new Animated.Value(0));
  const timeoutRef = useRef<number | null>(null)
  const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const navigation = useNavigation();
  const [recognizedIngredients, setRecognizedIngredients] = useState<FoodItem[]>([]);
  const [ingredientsAnalysisComplete, setIngredientsAnalysisComplete] = useState(false);
  const [findingRecipes, setFindingRecipes] = useState(false);
  const [recipeRecommendations, setRecipeRecommendations] = useState<Recipe[]>([]);
  const [showRecipeRecommendations, setShowRecipeRecommendations] = useState(false);
  const [recipeHistory, setRecipeHistory] = useState<Recipe[]>(initialRecipeHistory);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showRecipeDetail, setShowRecipeDetail] = useState(false);
  const [activeRecipeTab, setActiveRecipeTab] = useState("Bahan-bahan");

  useEffect(() => {
    (async () => {
      const granted = await requestCameraPermission();
      setHasPermission(granted);
    })();

    // Cleanup function to clear any pending timeouts when component unmounts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (spinLoopRef.current) {
        spinLoopRef.current.stop();
      }
    };
  }, []);

  // Animasi untuk modal
  useEffect(() => {
    if (showAddItemModal) {
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAddItemModal]);

  // Animasi untuk loading icon
  useEffect(() => {
    if (loading || findingRecipes) {
      spinLoopRef.current = Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      );
      spinLoopRef.current.start();
    } else {
      if (spinLoopRef.current) {
        spinLoopRef.current.stop();
      }
      spinAnimation.setValue(0);
    }
  }, [loading, findingRecipes]);

  // Function to simulate food recognition with a delay
  const simulateFoodRecognition = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      // Simulate food recognition
      const foods = [
        {
          id: Date.now().toString() + "1",
          name: "Nasi Goreng",
          calories: 350,
          weight: 200,
          unit: "g",
        },
        {
          id: Date.now().toString() + "2",
          name: "Telur Mata Sapi",
          calories: 90,
          weight: 44,
          unit: "g",
        },
        {
          id: Date.now().toString() + "3",
          name: "Udang",
          calories: 30,
          weight: 30,
          unit: "g",
        },
        {
          id: Date.now().toString() + "4",
          name: "Alpukat",
          calories: 350,
          weight: 200,
          unit: "g",
        },
      ];
      setRecognizedFoods(foods);
      setLoading(false);
      setAnalysisComplete(true);
      timeoutRef.current = null;
    }, 3000);
  };

  const simulateIngredientsRecognition = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      // Simulate ingredients recognition
      const ingredients = [
        {
          id: Date.now().toString() + "1",
          name: "Telur",
          calories: 210,
          weight: 150,
          unit: "g",
        },
        {
          id: Date.now().toString() + "2",
          name: "Alpukat",
          calories: 150,
          weight: 100,
          unit: "g",
        },
        {
          id: Date.now().toString() + "3",
          name: "Minyak Zaitun",
          calories: 252,
          weight: 14,
          unit: "g",
        },
        {
          id: Date.now().toString() + "4",
          name: "Almond",
          calories: 105,
          weight: 15,
          unit: "g",
        },
      ];
      setRecognizedIngredients(ingredients);
      setLoading(false);
      setIngredientsAnalysisComplete(true);
      timeoutRef.current = null;
    }, 3000);
  };

  // FIXED: Corrected navigateToRecipeDetail function to properly pass parameters
  const navigateToRecipeDetail = (recipe: Recipe) => {
    try {
      // Make sure recipe has all required properties
      if (!recipe || !recipe.id || !recipe.name) {
        console.error("Invalid recipe object:", recipe);
        return;
      }

      navigation.navigate("nutrilens/resepkuDetail", {
        id: recipe.id,
        name: recipe.name,
        calories: recipe.calories || 0,
        weight: recipe.weight || 0,
        unit: recipe.unit || "g",
        // Add default values for properties that might be used in the detail screen
        nutritionDetails: {
          carbs: 32,
          protein: 13,
          fat: 21,
          fiber: 7
        },
        ingredients: [
          "2 lembar roti gandum utuh",
          "1/2 buah alpukat matang",
          "6-8 buah tomat ceri, dibelah dua",
          "1 butir telur",
          "1 sdt minyak zaitun (untuk menggoreng telur)",
          "Garam dan lada secukupnya",
          "Perasan air lemon (opsional)"
        ],
        cookTime: "10 menit",
        difficulty: "Mudah"
      });

    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  // FIXED: Improved saveRecipeToHistory function to ensure complete recipe data
  const saveRecipeToHistory = (recipe: Partial<Recipe>) => {
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
        difficulty: recipe.difficulty || defaultRecipeData.difficulty
      };
      
      // Check if recipe already exists in history
      const exists = recipeHistory.some((item) => item.id === completeRecipe.id);
      if (!exists) {
        setRecipeHistory([completeRecipe, ...recipeHistory]);
      }
    } catch (error) {
      console.error("Error saving recipe to history:", error);
    }
  };

  const simulateFindRecipes = () => {
    setFindingRecipes(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Set a new timeout to simulate API call
    timeoutRef.current = setTimeout(() => {
      // FIXED: Create recipe objects with all necessary properties
      const recipes: Recipe[] = Array(7).fill(null).map((_, index) => ({
        id: Date.now().toString() + index,
        name: "Roti Lapis Alpukat",
        calories: 300,
        weight: 380,
        unit: "g",
        image: "../../assets/LoadingImg.png",
        nutritionDetails: defaultRecipeData.nutritionDetails,
        ingredients: defaultRecipeData.ingredients,
        cookTime: defaultRecipeData.cookTime,
        difficulty: defaultRecipeData.difficulty
      }));
      
      setRecipeRecommendations(recipes);
      setFindingRecipes(false);
      setShowRecipeRecommendations(true);
      
      // Save the first recipe to history
      if (recipes.length > 0) {
        saveRecipeToHistory(recipes[0]);
      }
      
      timeoutRef.current = null;
    }, 3000);
  };

  const handleTakeFoodPicture = async () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setShowCameraScreen(true);
    const uri = await takePicture();

    if (uri) {
      setImageUri(uri);
      setLoading(true);
      setAnalysisComplete(false);
      setRecognizedFoods([]);
      setShowCameraScreen(false);

      try {
        simulateFoodRecognition();
      } catch (error) {
        console.error("Error recognizing food:", error);
        setLoading(false);
      }
    } else {
      setShowCameraScreen(false);
    }
  };

  const handleTakeIngredientsPicture = async () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset states
    setRecognizedIngredients([]);
    setIngredientsAnalysisComplete(false);
    setShowRecipeRecommendations(false);
    
    setShowCameraScreen(true);
    const uri = await takePicture();
    
    if (uri) {
      setImageUri(uri);
      setLoading(true);
      setShowCameraScreen(false);
      
      // Simulate ingredients recognition
      simulateIngredientsRecognition();
    } else {
      setShowCameraScreen(false);
    }
  };

  const handleSaveFood = () => {
    // Tampilkan modal sukses
    setShowSuccessModal(true);

    // Simpan makanan ke riwayat dan kembali ke layar utama setelah 2 detik
    setTimeout(() => {
      setFoodHistory([...foodHistory, ...recognizedFoods]);
      setShowSuccessModal(false);
      setImageUri(null);
      setRecognizedFoods([]);
      setAnalysisComplete(false);
    }, 2000);
  };

  const handleRetake = async () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset states before taking a new picture
    setLoading(false);
    setAnalysisComplete(false);
    setRecognizedFoods([]);

    setShowCameraScreen(true);
    const uri = await takePicture();

    if (uri) {
      setImageUri(uri);
      setLoading(true);
      setShowCameraScreen(false);

      // Simulate food recognition
      simulateFoodRecognition();
    } else {
      setShowCameraScreen(false);
    }
  };

  const handleRemoveFood = (id: string) => {
    setRecognizedFoods(recognizedFoods.filter((food) => food.id !== id));
  };

  const handleAddItemClick = () => {
    setShowAddItemModal(true);
    resetNewItemFields();
  };

  const handleCloseModal = () => {
    setShowAddItemModal(false);
    setShowDetailFields(false);
    resetNewItemFields();
  };

  const resetNewItemFields = () => {
    setNewItemName("");
    setNewItemPortion("");
    setNewItemCalories("");
    setNewItemCarbs("");
    setNewItemProtein("");
    setNewItemFat("");
    setNewItemFiber("");
  };

  const handleSearchClick = () => {
    setShowDetailFields(true);
    Keyboard.dismiss();
  };

  const handleSaveNewItem = () => {
    if (newItemName.trim() === "") {
      // Validasi nama item tidak boleh kosong
      return;
    }

    const newFood: FoodItem = {
      id: Date.now().toString(),
      name: newItemName,
      calories: Number.parseInt(newItemCalories) || 0,
      weight: Number.parseInt(newItemPortion) || 0,
      unit: "g",
    };

    setRecognizedFoods([...recognizedFoods, newFood]);
    handleCloseModal();
  };

  const handleFindRecipes = () => {
    simulateFindRecipes();
  };

  const handleRemoveIngredient = (id: string) => {
    setRecognizedIngredients(recognizedIngredients.filter((ingredient) => ingredient.id !== id));
  };

  const handleSaveNewIngredient = () => {
    if (newItemName.trim() === "") {
      // Validasi nama item tidak boleh kosong
      return;
    }

    const newIngredient: FoodItem = {
      id: Date.now().toString(),
      name: newItemName,
      calories: Number.parseInt(newItemCalories) || 0,
      weight: Number.parseInt(newItemPortion) || 0,
      unit: "g",
    };

    setRecognizedIngredients([...recognizedIngredients, newIngredient]);
    handleCloseModal();
  };

  const handleBackToNutriLens = () => {
    setShowRecipeRecommendations(false);
    setImageUri(null);
    setRecognizedIngredients([]);
    setIngredientsAnalysisComplete(false);
  };

  const handleRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeDetail(true);
  };

  const handleBackFromRecipeDetail = () => {
    setShowRecipeDetail(false);
    setSelectedRecipe(null);
    setActiveRecipeTab("Bahan-bahan");
  };

  const handleSaveRecipe = () => {
    // Check if recipe already exists in history
    if (selectedRecipe && !recipeHistory.some(recipe => recipe.id === selectedRecipe.id)) {
      setRecipeHistory([selectedRecipe, ...recipeHistory]);
    }
    handleBackFromRecipeDetail();
    setShowRecipeRecommendations(false);
    setImageUri(null);
  };

  // FIXED: Removed redundant openRecipeDetail function since we already have navigateToRecipeDetail

  if (hasPermission === null) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Meminta izin kamera...</Text>
      </SafeAreaView>
    );
  }

  const handleAddFood = (food: FoodItem) => {
    // Tambahkan makanan ke riwayat
    const newFood = { ...food, id: Date.now().toString() };
    setFoodHistory([...foodHistory, newFood]);
  };

  const handleMealSelect = (meal: string) => {
    setSelectedMeal(meal);
    setShowMealOptions(false);
  };

  // Recipe Detail Screen
  if (showRecipeDetail) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 bg-white">
          <View className="p-4 flex-row items-center">
            <TouchableOpacity onPress={handleBackFromRecipeDetail} className="mr-2">
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="text-xl font-bold">ResepKu</Text>
            <View className="flex-1 items-end">
              <TouchableOpacity>
                <Ionicons name="bookmark-outline" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1">
            {/* Recipe Image */}
            <Image
              source={require("../../assets/LoadingImg.png")}
              className="w-full h-48"
              resizeMode="cover"
            />

            {/* Recipe Title and Info */}
            <View className="p-4">
              <Text className="text-2xl font-bold mb-2">{selectedRecipe?.name}</Text>
              <View className="flex-row items-center mb-4">
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text className="text-gray-600 ml-1 mr-4">{selectedRecipe?.cookTime}</Text>
                <View className="bg-green-100 rounded-lg px-3 py-1">
                  <Text className="text-green-600">{selectedRecipe?.difficulty}</Text>
                </View>
              </View>

              {/* Nutrition Circle */}
              <View className="flex-row items-center mb-6">
                <View className="mr-4">
                  <Text className="text-lg font-bold">{selectedRecipe?.weight} gram</Text>
                  <View className="flex-row items-center mt-1">
                    <View className="w-4 h-2 bg-purple-500 rounded-full mr-1" />
                    <Text className="text-xs text-gray-600">{selectedRecipe?.nutritionDetails?.carbs}g Karbohidrat</Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <View className="w-4 h-2 bg-blue-500 rounded-full mr-1" />
                    <Text className="text-xs text-gray-600">{selectedRecipe?.nutritionDetails?.protein}g Protein</Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <View className="w-4 h-2 bg-orange-500 rounded-full mr-1" />
                    <Text className="text-xs text-gray-600">{selectedRecipe?.nutritionDetails?.fat}g Lemak</Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <View className="w-4 h-2 bg-green-500 rounded-full mr-1" />
                    <Text className="text-xs text-gray-600">{selectedRecipe?.nutritionDetails?.fiber}g Serat</Text>
                  </View>
                </View>

                <View className="w-24 h-24 rounded-full border-8 border-orange-500 items-center justify-center">
                  <Text className="text-2xl font-bold">{selectedRecipe?.calories}</Text>
                  <Text className="text-xs">kkal</Text>
                </View>
              </View>

              {/* Tabs */}
              <View className="flex-row mb-4 border-b border-gray-200">
                <TouchableOpacity
                  className={`py-2 px-4 ${activeRecipeTab === "Bahan-bahan" ? "border-b-2 border-green-500" : ""}`}
                  onPress={() => setActiveRecipeTab("Bahan-bahan")}
                >
                  <Text className={activeRecipeTab === "Bahan-bahan" ? "text-green-500 font-bold" : "text-gray-500"}>
                    Bahan-bahan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`py-2 px-4 ${activeRecipeTab === "Cara Membuat" ? "border-b-2 border-green-500" : ""}`}
                  onPress={() => setActiveRecipeTab("Cara Membuat")}
                >
                  <Text className={activeRecipeTab === "Cara Membuat" ? "text-green-500 font-bold" : "text-gray-500"}>
                    Cara Membuat
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content */}
              {activeRecipeTab === "Bahan-bahan" && (
                <View>
                  {selectedRecipe?.ingredients?.map((ingredient: string, index: number) => (
                    <View key={index} className="flex-row items-center mb-2">
                      <Text className="text-sm">• {ingredient}</Text>
                    </View>
                  ))}
                </View>
              )}

              {activeRecipeTab === "Cara Membuat" && (
                <View>
                  <Text className="text-gray-500 italic">Cara membuat akan segera hadir!</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-green-500 m-4 py-3 rounded-lg items-center"
            onPress={handleSaveRecipe}
          >
            <Text className="text-white font-bold">Simpan Resep</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Tampilan analisis makanan
  if (imageUri) {
    // If we're showing recipe recommendations
    if (showRecipeRecommendations) {
      return (
        <SafeAreaView className="flex-1 bg-gray-100">
          <View className="flex-1 bg-white">
            <View className="p-4 flex-row items-center">
              <TouchableOpacity onPress={handleBackToNutriLens} className="mr-2">
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
                
                {recipeRecommendations.slice(0, 5).map((recipe) => (
                  <TouchableOpacity 
                    key={recipe.id} 
                    className="flex-row items-center py-3 border-b border-gray-200"
                    onPress={() => navigateToRecipeDetail(recipe)}
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
              
              {recipeRecommendations.slice(5, 7).map((recipe) => (
                <TouchableOpacity 
                  key={recipe.id} 
                  className="flex-row items-center py-3 px-4 border-b border-gray-200"
                  onPress={() => navigateToRecipeDetail(recipe)}
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
                onPress={handleBackToNutriLens}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#10B981" />
                <Text className="text-green-500 font-bold ml-2">Kembali ke NutriLens</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      );
    }
    
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 bg-white">
          {loading ? (
            // Loading screen - menampilkan gambar dengan overlay loading
            <View className="flex-1">
              <View className="p-4">
                <Text className="text-center text-gray-600 mb-4">
                  Cukup arahkan kamera ke {activeTab === "NutriKu" ? "makananmu" : "bahan-bahanmu"}, lalu tekan tombol untuk melihat {activeTab === "NutriKu" ? "nutrisinya" : "resep yang cocok"}.
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
                <TouchableOpacity onPress={() => {
                  setImageUri(null);
                  setRecognizedFoods([]);
                  setRecognizedIngredients([]);
                  setAnalysisComplete(false);
                  setIngredientsAnalysisComplete(false);
                }} className="mr-2">
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
                      <View className="relative mb-4">
                        <TouchableOpacity
                          className="border border-orange-500 rounded-full px-4 py-2 flex-row items-center justify-between "
                          style={{ width: 130 }}
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

                      {recognizedFoods.map((food) => (
                        <View key={food.id} className="border-b border-gray-200 py-4 flex-row justify-between items-center">
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
                          <TouchableOpacity onPress={() => handleRemoveFood(food.id)}>
                            <Ionicons name="trash-outline" size={24} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </>
                  )}

                  {activeTab === "ResepKu" && ingredientsAnalysisComplete && (
                    <>
                      {recognizedIngredients.map((ingredient) => (
                        <View key={ingredient.id} className="border-b border-gray-200 py-4 flex-row justify-between items-center">
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
                          <TouchableOpacity onPress={() => handleRemoveIngredient(ingredient.id)}>
                            <Ionicons name="trash-outline" size={24} color="#6B7280" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </>
                  )}

                  <TouchableOpacity
                    className="flex-row items-center justify-end mt-6 mb-4"
                    onPress={handleAddItemClick}
                  >
                    <Ionicons name="add-circle" size={20} color="#fe572f" />
                    <Text className="color-[#fe572f] font-bold ml-2">Tambah Item</Text>
                  </TouchableOpacity>

                  <View className="flex-row mt-8 mb-4">
                    <TouchableOpacity
                      className="flex-1 border border-[#fe572f] rounded-lg py-4 items-center justify-center mr-2"
                      onPress={activeTab === "NutriKu" ? handleRetake : handleTakeIngredientsPicture}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="camera" size={20} color="#fe572f" />
                        <Text className="text-orange-500 font-bold ml-2">NutriLens</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 bg-orange-500 rounded-lg py-4 items-center justify-center ml-2"
                      onPress={activeTab === "NutriKu" ? handleSaveFood : handleFindRecipes}
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

          {/* Modal Tambah Item */}
          <Modal
            visible={showAddItemModal}
            transparent={true}
            animationType="none"
            onRequestClose={handleCloseModal}
          >
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              activeOpacity={1}
              onPress={handleCloseModal}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: modalAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [600, 0],
                      }),
                    },
                  ],
                }}
                className="bg-white rounded-t-3xl absolute bottom-0 left-0 right-0 p-5"
              >
                <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-4" />

                <Text className="text-lg font-semibold mb-4">Nama Item</Text>
                <View className="flex-row mb-6">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-l-lg px-4 py-3"
                    placeholder="Misal: Sosis"
                    value={newItemName}
                    onChangeText={setNewItemName}
                  />
                  <TouchableOpacity
                    className="bg-orange-500 rounded-r-lg px-4 items-center justify-center"
                    onPress={handleSearchClick}
                  >
                    <Ionicons name="search" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                {showDetailFields && (
                  <>
                    <View className="mb-4">
                      <Text className="mb-2">Porsi</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={newItemPortion}
                          onChangeText={setNewItemPortion}
                        />
                        <Text className="ml-2">g</Text>
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="mb-2">Kalori</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={newItemCalories}
                          onChangeText={setNewItemCalories}
                        />
                        <Text className="ml-2">kkal</Text>
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="mb-2">Karbohidrat</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={newItemCarbs}
                          onChangeText={setNewItemCarbs}
                        />
                        <Text className="ml-2">g</Text>
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="mb-2">Protein</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={newItemProtein}
                          onChangeText={setNewItemProtein}
                        />
                        <Text className="ml-2">g</Text>
                      </View>
                    </View>

                    <View className="mb-4">
                      <Text className="mb-2">Lemak</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={newItemFat}
                          onChangeText={setNewItemFat}
                        />
                        <Text className="ml-2">g</Text>
                      </View>
                    </View>

                    <View className="mb-6">
                      <Text className="mb-2">Serat</Text>
                      <View className="flex-row items-center">
                        <TextInput
                          className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={newItemFiber}
                          onChangeText={setNewItemFiber}
                        />
                        <Text className="ml-2">g</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      className="bg-orange-500 rounded-lg py-4 items-center"
                      onPress={activeTab === "NutriKu" ? handleSaveNewItem : handleSaveNewIngredient}
                    >
                      <Text className="text-white font-bold">Simpan</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Animated.View>
            </TouchableOpacity>
          </Modal>

          {/* Modal Sukses */}
          <Modal
            visible={showSuccessModal}
            transparent={true}
            animationType="fade"
          >
            <View
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              className="items-center justify-center"
            >
              <View className="bg-white rounded-lg p-6 w-80 items-center">
                <Image
                  source={require("../../assets/NutrackerImageModal.png")}
                  className="w-40 h-40 mb-4"
                  resizeMode="contain"
                />
                <Text className="text-lg font-bold text-center mb-2">
                  Asupan berhasil ditambahkan ke Nutracker
                </Text>
              </View>
            </View>
          </Modal>

          {/* Modal Finding Recipes */}
          <Modal
            visible={findingRecipes}
            transparent={true}
            animationType="fade"
          >
            <View
              style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
              className="items-center justify-center"
            >
              <View className="bg-white rounded-lg p-6 w-80 items-center">
                <View className="mb-4">
                  <View className="w-10 h-10 items-center justify-center">
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
                        className="w-10 h-10"
                        resizeMode="contain"
                      />
                    </Animated.View>
                  </View>
                </View>
                <Text className="text-center mb-2">
                  Tunggu sebentar, kami sedang mencari resep yang cocok dengan bahan-bahan kamu.
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }

  // Tampilan utama
  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-3">
      <View className="flex-1 bg-white rounded-lg">
        <ScrollView className="flex-1 p-4">


          {/* Meal Selector Dropdown */}
          <View className="relative mb-4">
            <TouchableOpacity
              className="border border-orange-500 rounded-full px-4 py-2 flex-row items-center justify-between "
              style={{ width: 130 }}
              onPress={() => setShowMealOptions(!showMealOptions)}
            >
              <Text className="text-orange-500 mr-2">{selectedMeal}</Text>
              <Ionicons
                name={showMealOptions ? "chevron-up" : "chevron-down"}
                size={16}
                color="#FF5733"
              />
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
            <TouchableOpacity
              className="bg-red-100 rounded-lg p-4 w-[48%] items-center"
              onPress={() => {
                setActiveTab("NutriKu");
                handleTakeFoodPicture();
              }}
            >
              <View className="w-16 h-16 mb-2 items-center justify-center">
                <View className="absolute">
                  <MaterialCommunityIcons
                    name="square-rounded-outline"
                    size={48}
                    color="#FF5733"
                  />
                </View>
                <Ionicons name="camera" size={24} color="#FF5733" />
              </View>
              <Text className="text-center font-semibold text-red-500">
                Scan Makananmu
              </Text>
              <Text className="text-center text-xs text-gray-600 mt-1">
                Ketahui kandungan nutrisi asupan makananmu
              </Text>
            </TouchableOpacity>

            {/* Scan Ingredients */}
            <TouchableOpacity
              className="bg-green-100 rounded-lg p-4 w-[48%] items-center"
              onPress={() => {
                setActiveTab("ResepKu");
                handleTakeIngredientsPicture();
              }}
            >
              <View className="w-16 h-16 mb-2 items-center justify-center">
                <View className="absolute">
                  <MaterialCommunityIcons
                    name="square-rounded-outline"
                    size={48}
                    color="#22C55E"
                  />
                </View>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={24}
                  color="#22C55E"
                />
              </View>
              <Text className="text-center font-semibold text-green-500">
                Scan Bahan-bahanmu
              </Text>
              <Text className="text-center text-xs text-gray-600 mt-1">
                Dapatkan resep dari bahan-bahan yang kamu punya!
              </Text>
            </TouchableOpacity>
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
          <View className="flex-row mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 ${
                activeTab === "NutriKu" ? "bg-orange-500" : "bg-white"
              } rounded-l-3xl rounded-r-3xl items-center`}
              onPress={() => setActiveTab("NutriKu")}
            >
              <Text
                className={
                  activeTab === "NutriKu"
                    ? "text-white font-bold"
                    : "text-gray-500"
                }
              >
                NutriKu
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 ${
                activeTab === "ResepKu" ? "bg-green-500" : "bg-white"
              } rounded-r-3xl rounded-l-3xl items-center`}
              onPress={() => setActiveTab("ResepKu")}
            >
              <Text
                className={
                  activeTab === "ResepKu"
                    ? "text-white font-bold"
                    : "text-gray-500"
                }
              >
                ResepKu
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === "NutriKu" ? (
            <>
              {/* Food History */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Riwayat</Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Berikut asupan yang pernah kamu rekam nutrisinya.
                </Text>

                {foodHistory.map((food) => (
                  <FoodHistoryItem key={food.id} food={food} />
                ))}
              </View>

              {/* Suggestions */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Saran</Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Berikut asupan yang mungkin kamu konsumsi.
                </Text>

                {suggestedFoods.map((food) => (
                  <FoodHistoryItem
                    key={food.id}
                    food={food}
                    showAddButton
                    onAddPress={() => handleAddFood(food)}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Recipe History */}
              <View className="mb-6">
                <Text className="text-lg font-bold mb-2">Riwayat</Text>
                <Text className="text-sm text-gray-600 mb-4">
                  Berikut resep yang pernah kamu rekam.
                </Text>

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
                        <TouchableOpacity className="p-2">
                          <Ionicons name="add-circle-outline" size={24} color="#10B981" />
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

          {/* Success Message */}
          {showSuccessModal && (
            <View className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex-row items-center mb-4">
              <Ionicons name="checkmark-circle" size={24} color="#FF5733" className="mr-2" />
              <Text className="text-orange-500">Nama Item berhasil ditambahkan ke NuTracker</Text>
            </View>
          )}
        </ScrollView>

      </View>

      {/* Modal Tambah Item */}
      <Modal
        visible={showAddItemModal}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateY: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            }}
            className="bg-white rounded-t-3xl absolute bottom-0 left-0 right-0 p-5"
          >
            <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-4" />

            <Text className="text-lg font-semibold mb-4">Nama Item</Text>
            <View className="flex-row mb-6">
              <TextInput
                className="flex-1 bg-gray-100 rounded-l-lg px-4 py-3"
                placeholder="Misal: Sosis"
                value={newItemName}
                onChangeText={setNewItemName}
              />
              <TouchableOpacity
                className="bg-orange-500 rounded-r-lg px-4 items-center justify-center"
                onPress={handleSearchClick}
              >
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {showDetailFields && (
              <>
                <View className="mb-4">
                  <Text className="mb-2">Porsi</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItemPortion}
                      onChangeText={setNewItemPortion}
                    />
                    <Text className="ml-2">g</Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2">Kalori</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItemCalories}
                      onChangeText={setNewItemCalories}
                    />
                    <Text className="ml-2">kkal</Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2">Karbohidrat</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItemCarbs}
                      onChangeText={setNewItemCarbs}
                    />
                    <Text className="ml-2">g</Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2">Protein</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItemProtein}
                      onChangeText={setNewItemProtein}
                    />
                    <Text className="ml-2">g</Text>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className="mb-2">Lemak</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItemFat}
                      onChangeText={setNewItemFat}
                    />
                    <Text className="ml-2">g</Text>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="mb-2">Serat</Text>
                  <View className="flex-row items-center">
                    <TextInput
                      className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                      placeholder="0"
                      keyboardType="numeric"
                      value={newItemFiber}
                      onChangeText={setNewItemFiber}
                    />
                    <Text className="ml-2">g</Text>
                  </View>
                </View>

                <TouchableOpacity
                  className="bg-orange-500 rounded-lg py-4 items-center"
                  onPress={activeTab === "NutriKu" ? handleSaveNewItem : handleSaveNewIngredient}
                >
                  <Text className="text-white font-bold">Simpan</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}