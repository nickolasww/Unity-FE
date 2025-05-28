"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native"
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
import { AlertTriangle, Camera } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define interfaces
interface FoodItem {
  carbs?: number
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
    breakfast: FoodItem[] | null
    lunch: FoodItem[] | null
    dinner: FoodItem[] | null
  }
}

// API URL - use the provided endpoint
const API_URL = "https://nutripath.bccdev.id/api/v1/trackers/get-tracker"

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

// Helper function to format date consistently
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Helper function to create date from string (for availableDates)
const createDateFromString = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number)
  return new Date(year, month - 1, day)
}

// Helper function to safely map food items
const safeFoodItemMap = (items: FoodItem[] | null | undefined): FoodItem[] => {
  if (!items || !Array.isArray(items)) {
    return []
  }

  return items.map((item) => ({
    id: item.id || 0,
    name: item.name || "Unknown Food",
    calories: item.calories || 0,
    carbs: item.carbohydrates || 0,
    protein: item.protein || 0,
    fat: item.fats || 0,
    fiber: item.fiber || 0,
    created_at: item.created_at || "",
    steps: item.steps || [],
    recipes: item.recipes || [],
    difficulty: item.difficulty || "",
  }))
}

export default function NuTracker() {
  // PENTING: Semua hooks harus dipanggil di awal komponen, tidak boleh kondisional
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalVisible, setModalVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [addItemSheetVisible, setAddItemSheetVisible] = useState(false)
  const [activeMealType, setActiveMealType] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [hasData, setHasData] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [tokenChecked, setTokenChecked] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // State untuk menyimpan data makanan
  const [meals, setMeals] = useState<Meal[]>(defaultMeals)

  // State untuk menyimpan data nutrisi
  const [nutritionData, setNutritionData] = useState<NutritionData>(defaultNutritionData)

  // PENTING: Semua useCallback harus dipanggil setelah useState, tidak boleh kondisional
  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const checkRefreshFlag = useCallback(async () => {
    try {
      const needsRefresh = await AsyncStorage.getItem("needsRefresh")
      if (needsRefresh === "true") {
        await AsyncStorage.removeItem("needsRefresh")
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking refresh flag:", error)
      return false
    }
  }, [])

  const handleManualRefresh = useCallback(() => {
    console.log("Manual refresh triggered")
    triggerRefresh()
  }, [triggerRefresh])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchNutritionData()
    setRefreshing(false)
  }, []) // Akan ditambahkan fetchNutritionData ke dependencies nanti

  // Fetch data from API based on selected date
  const fetchNutritionData = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setHasData(false)

    try {
      const formattedDate = formatDateForAPI(selectedDate)
      console.log("Fetching data for date:", formattedDate)

      if (!token) {
        setIsError(true)
        setErrorMessage("Token tidak ditemukan. Silakan login ulang.")
        setIsLoading(false)
        return
      }

      // Fetch data from the provided API endpoint
      const response = await fetch(`${API_URL}?date=${formattedDate}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("API request URL:", `${API_URL}?date=${formattedDate}`)
      console.log("API response status:", response.status)

      if (!response.ok) {
        if (response.status === 404) {
          console.log("No data found for date:", formattedDate)
          setMeals(defaultMeals)
          setNutritionData(defaultNutritionData)
          setHasData(false)
          setIsError(false)
          setIsLoading(false)
          return
        } else if (response.status === 401) {
          setIsError(true)
          setErrorMessage("Token tidak valid atau kadaluarsa. Silakan login ulang.")
          await AsyncStorage.removeItem("authToken")
          setToken(null)
          setIsLoading(false)
          return
        }

        // Handle other error responses
        let errorMessage = `API request failed with status ${response.status}`
        try {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const errorBody = await response.json()
            errorMessage += ` | Server message: ${errorBody.error || JSON.stringify(errorBody)}`
          } else {
            const errorText = await response.text()
            errorMessage += ` | Server message: ${errorText}`
          }
        } catch (parseErr) {
          errorMessage += " | (Gagal membaca pesan error dari server)"
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log("API response data:", data)

      // Check if API response is successful and has valid data
      if (data.message === "success" && data.trackers) {
        updateDataFromAPI(data)
        setHasData(true)

        // Add this date to available dates if not already present
        setAvailableDates((prev) => {
          const dateExists = prev.some((date) => formatDateForAPI(date) === formattedDate)
          if (!dateExists) {
            const newDate = createDateFromString(formattedDate)
            return [...prev, newDate]
          }
          return prev
        })
      } else {
        console.log("API response indicates no data or invalid structure")
        setMeals(defaultMeals)
        setNutritionData(defaultNutritionData)
        setHasData(false)
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
      setIsError(true)
      setErrorMessage("Gagal memuat data. Silakan coba lagi.")
      setMeals(defaultMeals)
      setNutritionData(defaultNutritionData)
      setHasData(false)
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, token]) // Tambahkan dependencies yang dibutuhkan

  // Update dependencies untuk onRefresh
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedOnRefresh = useCallback(async () => {
    setRefreshing(true)
    await fetchNutritionData()
    setRefreshing(false)
  }, [fetchNutritionData])

  // Fetch data from API based on selected date
  useEffect(() => {
    if (token && tokenChecked) {
      fetchNutritionData()
    }
  }, [selectedDate, token, tokenChecked, refreshTrigger, fetchNutritionData])

  // Get token on component mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken")
        console.log("Retrieved token:", storedToken ? "Token exists" : "No token found")

        setToken(storedToken)
        setTokenChecked(true)

        if (!storedToken) {
          setIsError(true)
          setErrorMessage("Token tidak ditemukan. Silakan login ulang.")
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error retrieving token:", error)
        setIsError(true)
        setErrorMessage("Gagal mengambil token. Silakan login ulang.")
        setIsLoading(false)
        setTokenChecked(true)
      }
    }

    getToken()
  }, [])

  // Check for refresh flag when component mounts or becomes visible
  useEffect(() => {
    const checkForUpdates = async () => {
      if (token && tokenChecked) {
        const needsRefresh = await checkRefreshFlag()
        if (needsRefresh) {
          console.log("Refresh flag detected, fetching new data...")
          fetchNutritionData()
        }
      }
    }

    checkForUpdates()
  }, [token, tokenChecked, refreshTrigger, checkRefreshFlag, fetchNutritionData])

  // Update local state with data from API - WITH NULL SAFETY
  const updateDataFromAPI = (data: TrackerData) => {
    console.log("Updating data from API:", data)

    // Safely extract trackers data with fallbacks
    const trackers = data.trackers || ({} as TrackerData["trackers"])

    // Safely map meal items with null checks
    const breakfastItems = safeFoodItemMap(trackers.breakfast)
    const lunchItems = safeFoodItemMap(trackers.lunch)
    const dinnerItems = safeFoodItemMap(trackers.dinner)

    console.log("Processed meal items:", {
      breakfast: breakfastItems.length,
      lunch: lunchItems.length,
      dinner: dinnerItems.length,
    })

    // Update meals with safe data
    const updatedMeals = [
      {
        type: "Sarapan",
        icon: "🍳",
        calories: trackers.total_breakfast_calories || 0,
        items: breakfastItems,
      },
      {
        type: "Makan Siang",
        icon: "🍽️",
        calories: trackers.total_lunch_calories || 0,
        items: lunchItems,
      },
      {
        type: "Makan Malam",
        icon: "🌙",
        calories: trackers.total_dinner_calories || 0,
        items: dinnerItems,
      },
    ]

    setMeals(updatedMeals)

    // Update nutrition data with fallbacks
    setNutritionData({
      calories: {
        current: trackers.total_calories || 0,
        target: trackers.daily_calories || 2000,
      },
      carbs: {
        current: trackers.total_carbohydrate || 0,
        target: trackers.daily_carbohydrate || 300,
        color: "purple",
      },
      protein: {
        current: trackers.total_protein || 0,
        target: trackers.daily_protein || 120,
        color: "blue",
      },
      fat: {
        current: trackers.total_fat || 0,
        target: trackers.daily_fat || 67,
        color: "orange",
      },
      fiber: {
        current: trackers.total_fiber || 0,
        target: trackers.daily_fiber || 25,
        color: "green",
      },
    })

    console.log("Data update completed successfully")
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
    if (isFuture(date)) {
      Alert.alert("Perhatian", "Tidak dapat memilih tanggal di masa depan")
      return
    }

    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    setSelectedDate(normalizedDate)
  }

  // Fungsi untuk menambahkan item makanan baru
  const handleSaveItem = async (mealType: string, newItem: FoodItem) => {
    try {
      setMeals((prevMeals) => {
        return prevMeals.map((meal) => {
          if (meal.type === mealType) {
            const itemWithId = {
              ...newItem,
              id: Math.floor(Math.random() * 10000),
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

      updateNutritionTotals(newItem)
      setHasData(true)
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
        current: prev.carbs.current + (newItem.carbs || newItem.carbohydrates || 0),
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
      return format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })
    }
  }

  // Cek apakah kalori melebihi target
  const isCalorieExceeded = nutritionData.calories.current > nutritionData.calories.target

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
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={memoizedOnRefresh}
            colors={["#FF5733"]}
            tintColor="#FF5733"
          />
        }
      >
        {/* Calendar Section */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <TouchableOpacity className="flex-row items-center mb-2">
            <CalendarIcon onPress={() => setCalendarVisible(true)} />
            <Text className="ml-2 text-gray-500">{getDateText()}</Text>
          </TouchableOpacity>
          <CalendarStrip
            selectedDate={selectedDate}
            onDateSelected={handleDateSelected}
            availableDates={availableDates}
          />
        </View>

        {/* Error Message */}
        {isError && (
          <View className="bg-red-50 rounded-xl p-4 mb-4 flex-row items-center">
            <AlertTriangle size={20} color="#DC2626" />
            <Text className="ml-2 text-red-700">{errorMessage}</Text>
          </View>
        )}

        {/* No Data Message */}
        {!hasData && !isError && !isLoading && (
          <View className="bg-blue-50 rounded-xl p-4 mb-4 flex-row items-center">
            <Camera size={20} color="#2563EB" />
            <View className="ml-2 flex-1">
              <Text className="text-blue-700 font-medium">Belum ada data nutrisi</Text>
              <Text className="text-blue-600 text-sm">Gunakan NutriLens untuk memindai makanan Anda</Text>
            </View>
          </View>
        )}

        {/* Nutrition Summary */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <View className="flex-row">
            <View className="w-1/3 items-center justify-center">
              <NutritionCircle
                current={nutritionData.calories.current}
                target={nutritionData.calories.target}
                hasData={hasData}
              />
            </View>
            <View className="w-2/3">
              <NutritionBars nutritionData={nutritionData} hasData={hasData} />
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
