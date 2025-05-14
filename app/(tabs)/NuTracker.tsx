"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CalendarStrip } from "../nutracker/calendarstrip"
import { NutritionCircle } from "../nutracker/nutritioncircle"
import { NutritionBars } from "../nutracker/nutritonbar"
import { MealSection } from "../nutracker/mealsection"
import { AddFoodModal } from "../nutracker/addfoodmodal"
import { CalendarIcon } from "../nutracker/calendaricon"
import { FullCalendar } from "../nutracker/fullcalendar"
import AddItemSheet from "../../components/additem/additem"
import { format, isToday, isFuture } from "date-fns"
import { id } from "date-fns/locale"
import { AlertTriangle } from "lucide-react-native"

// Define interfaces
interface FoodItem {
  carbs: number
  id?: number
  name: string
  calories: number
  carbohydrates?: number
  protein?: number
  fats?: number
  fiber?: number
  portion?: number
  created_at?: string
  steps?: string[]
  recipes?: string[]
  difficulty?: string
}

interface Meal {
  type: string
  icon: string
  calories: number
  items: FoodItem[]
}

interface NutritionData {
  calories: {
    current: number
    target: number
  }
  carbs: {
    current: number
    target: number
    color: string
  }
  protein: {
    current: number
    target: number
    color: string
  }
  fat: {
    current: number
    target: number
    color: string
  }
  fiber: {
    current: number
    target: number
    color: string
  }
}

interface TrackerData {
  message: string
  trackers: {
    user_id: string
    daily_calories: number
    daily_carbohydrate: number
    daily_protein: number
    daily_fat: number
    daily_fiber: number
    total_calories: number
    total_mass: number
    total_carbohydrate: number
    total_protein: number
    total_fat: number
    total_fiber: number
    total_breakfast_calories: number
    total_lunch_calories: number
    total_dinner_calories: number
    breakfast: FoodItem[]
    lunch: FoodItem[]
    dinner: FoodItem[] | null
  }
}

// API URL - use the provided endpoint
const API_URL = "https://de43-118-99-68-242.ngrok-free.app/trackers/get-tracker"

// Default nutrition data
const defaultNutritionData: NutritionData = {
  calories: {
    current: 0,
    target: 2000,
  },
  carbs: {
    current: 0,
    target: 300,
    color: "purple",
  },
  protein: {
    current: 0,
    target: 120,
    color: "blue",
  },
  fat: {
    current: 0,
    target: 67,
    color: "orange",
  },
  fiber: {
    current: 0,
    target: 25,
    color: "green",
  },
}

// Default meals
const defaultMeals: Meal[] = [
  {
    type: "Sarapan",
    icon: "🍳",
    calories: 0,
    items: [],
  },
  {
    type: "Makan Siang",
    icon: "🍽️",
    calories: 0,
    items: [],
  },
  {
    type: "Makan Malam",
    icon: "🌙",
    calories: 0,
    items: [],
  },
]

export default function NuTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalVisible, setModalVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [addItemSheetVisible, setAddItemSheetVisible] = useState(false)
  const [activeMealType, setActiveMealType] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [availableDates, setAvailableDates] = useState<Date[]>([new Date()])
  const [hasData, setHasData] = useState(false)

  // State untuk menyimpan data makanan
  const [meals, setMeals] = useState<Meal[]>(defaultMeals)

  // State untuk menyimpan data nutrisi
  const [nutritionData, setNutritionData] = useState<NutritionData>(defaultNutritionData)

  // Fetch data from API based on selected date
  useEffect(() => {
    fetchNutritionData()
  }, [selectedDate])

  // Fetch available dates (this would be a separate API call in a real app)
  useEffect(() => {
    // In a real app, you would fetch available dates from an API
    // For now, we'll just use today's date as available
    setAvailableDates([new Date()])
  }, [])

  const fetchNutritionData = async () => {
    setIsLoading(true)
    setIsError(false)
    setHasData(false)

    try {
      // Format date for API request
      const formattedDate = format(selectedDate, "yyyy-MM-dd")

      // Fetch data from the provided API endpoint
      const response = await fetch(`${API_URL}?date=${formattedDate}`)

      if (!response.ok) {
        // If response is 404, it means no data for this date
        if (response.status === 404) {
          setIsError(true)
          setErrorMessage("Maaf, anda belum pernah scan makanan")
          // Reset to default values
          setMeals(defaultMeals)
          setNutritionData(defaultNutritionData)
          setHasData(false)
          setIsLoading(false)
          return
        }
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Check if API response is successful
      if (data.message === "success") {
        updateDataFromAPI(data)
        setHasData(true)
      } else {
        throw new Error("Failed to fetch nutrition data")
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
      setIsError(true)
      setErrorMessage("Maaf, anda belum pernah scan makanan")
      // Reset to default values
      setMeals(defaultMeals)
      setNutritionData(defaultNutritionData)
      setHasData(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Update local state with data from API
  const updateDataFromAPI = (data: TrackerData) => {
    const { trackers } = data

    // Update meals
    const updatedMeals = [
      {
        type: "Sarapan",
        icon: "🍳",
        calories: trackers.total_breakfast_calories,
        items: trackers.breakfast.map((item) => ({
          id: item.id,
          name: item.name,
          calories: item.calories,
          carbs: item.carbohydrates,
          protein: item.protein,
          fat: item.fats,
          fiber: item.fiber,
          created_at: item.created_at,
        })),
      },
      {
        type: "Makan Siang",
        icon: "🍽️",
        calories: trackers.total_lunch_calories,
        items: trackers.lunch.map((item) => ({
          id: item.id,
          name: item.name,
          calories: item.calories,
          carbs: item.carbohydrates,
          protein: item.protein,
          fat: item.fats,
          fiber: item.fiber,
          steps: item.steps,
          recipes: item.recipes,
          difficulty: item.difficulty,
          created_at: item.created_at,
        })),
      },
      {
        type: "Makan Malam",
        icon: "🌙",
        calories: trackers.total_dinner_calories,
        items: trackers.dinner
          ? trackers.dinner.map((item) => ({
              id: item.id,
              name: item.name,
              calories: item.calories,
              carbs: item.carbohydrates,
              protein: item.protein,
              fat: item.fats,
              fiber: item.fiber,
              created_at: item.created_at,
            }))
          : [],
      },
    ]

    setMeals(updatedMeals)

    // Update nutrition data
    setNutritionData({
      calories: {
        current: trackers.total_calories,
        target: trackers.daily_calories,
      },
      carbs: {
        current: trackers.total_carbohydrate,
        target: trackers.daily_carbohydrate,
        color: "purple",
      },
      protein: {
        current: trackers.total_protein,
        target: trackers.daily_protein,
        color: "blue",
      },
      fat: {
        current: trackers.total_fat,
        target: trackers.daily_fat,
        color: "orange",
      },
      fiber: {
        current: trackers.total_fiber,
        target: trackers.daily_fiber,
        color: "green",
      },
    })
  }

  const handleAddFood = (mealType: string) => {
    setActiveMealType(mealType)
    setModalVisible(true)
  }

  const handleAddManual = (mealType: string) => {
    setActiveMealType(mealType)
    setAddItemSheetVisible(true)
  }

  const handleReturnToModal = () => {
    setModalVisible(true)
  }

  // Handle date selection and fetch new data
  const handleDateSelected = (date: Date) => {
    // Don't allow selecting future dates
    if (isFuture(date)) {
      Alert.alert("Perhatian", "Tidak dapat memilih tanggal di masa depan")
      return
    }

    // In a real app, you would check if the date is in availableDates
    // For now, we'll just set the date and let the API handle it
    setSelectedDate(date)
  }

  // Fungsi untuk menambahkan item makanan baru
  const handleSaveItem = async (mealType: string, newItem: FoodItem) => {
    try {
      // First update local state for immediate feedback
      setMeals((prevMeals) => {
        return prevMeals.map((meal) => {
          if (meal.type === mealType) {
            // Add new item with a temporary ID
            const itemWithId = {
              ...newItem,
              id: Math.floor(Math.random() * 10000), // Temporary ID
              created_at: new Date().toISOString(),
            }

            const updatedItems = [...meal.items, itemWithId]
            const totalCalories = updatedItems.reduce((sum, item) => sum + item.calories, 0)

            return {
              ...meal,
              items: updatedItems,
              calories: totalCalories,
            }
          }
          return meal
        })
      })

      // Update nutrition totals
      updateNutritionTotals(newItem)

      // In a real app, you would send this to your API
      // This would be implemented in a future version

      // After successful API call, refresh data
      // fetchNutritionData()
    } catch (error) {
      console.error("Error adding food item:", error)
      Alert.alert("Error", "Gagal menambahkan makanan. Silakan coba lagi.", [{ text: "OK" }])
    }
  }

  // Update nutrition totals when adding a new item
  const updateNutritionTotals = (newItem: FoodItem) => {
    setNutritionData((prev) => ({
      ...prev,
      calories: {
        ...prev.calories,
        current: prev.calories.current + newItem.calories,
      },
      carbs: {
        ...prev.carbs,
        current: prev.carbs.current + (newItem.carbs || 0),
      },
      protein: {
        ...prev.protein,
        current: prev.protein.current + (newItem.protein || 0),
      },
      fat: {
        ...prev.fat,
        current: prev.fat.current + (newItem.fats || 0),
      },
      fiber: {
        ...prev.fiber,
        current: prev.fiber.current + (newItem.fiber || 0),
      },
    }))
  }

  // Menentukan teks untuk tanggal yang dipilih
  const getDateText = () => {
    if (isToday(selectedDate)) {
      return "Hari ini"
    } else {
      // Format hari dalam bahasa Indonesia
      return format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })
    }
  }

  // Cek apakah kalori melebihi target
  const isCalorieExceeded = nutritionData.calories.current > nutritionData.calories.target

  // Retry loading data if there was an error
  const handleRetry = () => {
    fetchNutritionData()
  }

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#FF5733" />
        <Text className="mt-4 text-gray-600">Memuat data nutrisi...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        {/* Calendar Section */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <TouchableOpacity className="flex-row items-center mb-2">
            <CalendarIcon onPress={() => setCalendarVisible(true)} />
            <Text className="ml-2 text-gray-500">{getDateText()}</Text>
          </TouchableOpacity>
          <CalendarStrip selectedDate={selectedDate} onDateSelected={handleDateSelected} />
        </View>

        {/* Error Message (if any) */}
        {isError && (
          <View className="bg-orange-50 rounded-xl p-4 mb-4 flex-row items-center">
            <AlertTriangle size={20} color="#FF5733" />
            <Text className="ml-2 text-orange-700">{errorMessage}</Text>
          </View>
        )}

        {/* Nutrition Summary */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row">
            <View className="w-1/3 items-center justify-center">
              <NutritionCircle current={nutritionData.calories.current} target={nutritionData.calories.target} />
            </View>
            <View className="w-2/3">
              <NutritionBars nutritionData={nutritionData} />
            </View>
          </View>

          {isCalorieExceeded && hasData && (
            <View className="mt-2 bg-yellow-50 p-2 rounded-lg flex-row items-center">
              <Text className="text-yellow-700 text-xs">⚠️ Total kalori melebihi target harian</Text>
            </View>
          )}
        </View>

        {/* Meals */}
        {meals.map((meal, index) => (
          <MealSection key={index} meal={meal} onAddFood={() => handleAddFood(meal.type)} />
        ))}
      </ScrollView>

      {/* Modal untuk memilih cara menambahkan makanan */}
      <AddFoodModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mealType={activeMealType}
        onAddManual={handleAddManual}
      />

      {/* Bottom sheet untuk menambahkan makanan secara manual */}
      <AddItemSheet
        visible={addItemSheetVisible}
        onClose={() => setAddItemSheetVisible(false)}
        mealType={activeMealType}
        onSave={handleSaveItem}
        onReturn={handleReturnToModal}
      />

      {/* Modal kalender */}
      <FullCalendar
        visible={calendarVisible}
        onClose={() => setCalendarVisible(false)}
        selectedDate={selectedDate}
        onDateSelected={handleDateSelected}
        availableDates={availableDates}
      />
    </SafeAreaView>
  )
}
