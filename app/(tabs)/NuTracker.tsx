"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { CalendarStrip } from "../nutracker/calendarstrip"
import { NutritionCircle } from "../nutracker/nutritioncircle"
import { NutritionBars } from "../nutracker/nutritonbar"
import { MealSection } from "../nutracker/mealsection"
import { AddFoodModal } from "../nutracker/addfoodmodal"
import { CalendarIcon } from "../nutracker/calendaricon"
import { FullCalendar } from "../nutracker/fullcalendar"
import AddItemSheet from "../../components/additem/additem"
import { format, isToday } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "expo-router"

// Define interfaces
interface FoodItem {
  name: string
  calories: number
  portion?: number
  carbs?: number
  protein?: number
  fat?: number
  fiber?: number
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

export default function NuTracker() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalVisible, setModalVisible] = useState(false)
  const [calendarVisible, setCalendarVisible] = useState(false)
  const [addItemSheetVisible, setAddItemSheetVisible] = useState(false)
  const [activeMealType, setActiveMealType] = useState("")

  // State untuk menyimpan data makanan
  const [meals, setMeals] = useState<Meal[]>([
    {
      type: "Sarapan",
      icon: "🍳",
      calories: 330,
      items: [
        { name: "Roti Lapis Alpukat", calories: 300 },
        { name: "Susu", calories: 30 },
      ],
    },
    {
      type: "Makan Siang",
      icon: "🍽️",
      calories: 330,
      items: [
        { name: "Roti Lapis Alpukat", calories: 300 },
        { name: "Susu", calories: 30 },
      ],
    },
    {
      type: "Makan Malam",
      icon: "🍽️",
      calories: 330,
      items: [
        { name: "Roti Lapis Alpukat", calories: 300 },
        { name: "Susu", calories: 30 },
      ],
    },
  ])

  // State untuk menyimpan data nutrisi
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    calories: {
      current: 2102,
      target: 2000,
    },
    carbs: {
      current: 263,
      target: 300,
      color: "purple",
    },
    protein: {
      current: 95,
      target: 120,
      color: "blue",
    },
    fat: {
      current: 82,
      target: 67,
      color: "orange",
    },
    fiber: {
      current: 18,
      target: 25,
      color: "green",
    },
  })

  // Update nutrition data when meals change
  useEffect(() => {
    updateNutritionData()
  }, [meals])

  // Fungsi untuk menghitung total nutrisi dari semua makanan
  const updateNutritionData = () => {
    let totalCalories = 0
    let totalCarbs = 0
    let totalProtein = 0
    let totalFat = 0
    let totalFiber = 0

    meals.forEach((meal) => {
      meal.items.forEach((item) => {
        totalCalories += item.calories || 0
        totalCarbs += item.carbs || 0
        totalProtein += item.protein || 0
        totalFat += item.fat || 0
        totalFiber += item.fiber || 0
      })
    })

    setNutritionData((prev) => ({
      ...prev,
      calories: {
        ...prev.calories,
        current: totalCalories,
      },
      carbs: {
        ...prev.carbs,
        current: totalCarbs,
      },
      protein: {
        ...prev.protein,
        current: totalProtein,
      },
      fat: {
        ...prev.fat,
        current: totalFat,
      },
      fiber: {
        ...prev.fiber,
        current: totalFiber,
      },
    }))
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
    // Buka kembali modal pilihan setelah bottom sheet ditutup
    setModalVisible(true)
  }

  // Fungsi untuk menambahkan item makanan baru
  const handleSaveItem = (mealType: string, newItem: FoodItem) => {
    setMeals((prevMeals) => {
      return prevMeals.map((meal) => {
        if (meal.type === mealType) {
          // Tambahkan item baru ke meal yang sesuai
          const updatedItems = [...meal.items, newItem]
          // Hitung ulang total kalori
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
  }

  // Menentukan teks untuk tanggal yang dipilih
  const getDateText = () => {
    if (isToday(selectedDate)) {
      return "Hari ini"
    } else {
      // Format hari dalam bahasa Indonesia
      return format(selectedDate, "EEEE", { locale: id })
    }
  }

  // Cek apakah kalori melebihi target
  const isCalorieExceeded = nutritionData.calories.current > nutritionData.calories.target

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="px-4 py-2">
        <Text className="text-2xl font-bold text-center">NuTracker</Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Calendar Section */}
        <View className="bg-white rounded-xl p-4 mb-4">
          <TouchableOpacity className="flex-row items-center mb-2" >
            <CalendarIcon onPress={() => setCalendarVisible(true)}/>
            <Text className="ml-2 text-gray-500">{getDateText()}</Text>
          </TouchableOpacity>
          <CalendarStrip selectedDate={selectedDate} onDateSelected={setSelectedDate} />
        </View>

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

          {isCalorieExceeded && (
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
        onDateSelected={setSelectedDate}
      />
    </SafeAreaView>
  )
}
