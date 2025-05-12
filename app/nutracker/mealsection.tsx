import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Plus } from "lucide-react-native"

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

interface MealSectionProps {
  meal: Meal
  onAddFood: () => void
}

export const MealSection: React.FC<MealSectionProps> = ({ meal, onAddFood }) => {
  // Hitung total kalori dari semua item
  const totalCalories = meal.items.reduce((sum, item) => sum + item.calories, 0)

  return (
    <View className="bg-white rounded-xl mb-4 overflow-hidden">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <Text className="text-lg mr-2">{meal.icon}</Text>
          <Text className="text-lg font-medium">{meal.type}</Text>
        </View>
        <View className="flex-row items-center">
          <View className="bg-orange-100 px-2 py-1 rounded-lg mr-2">
            <Text className="text-orange-500 text-xs">{totalCalories} kkal</Text>
          </View>
          <TouchableOpacity
            onPress={onAddFood}
            className="w-8 h-8 rounded-full bg-orange-50 items-center justify-center"
          >
            <Plus size={20} color="#FF5733" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Food Items */}
      {meal.items.map((item, index) => (
        <View key={`${item.name}-${index}`} className="flex-row justify-between py-3 px-4 border-t border-gray-100">
          <Text>{item.name}</Text>
          <Text>{item.calories} kkal</Text>
        </View>
      ))}
    </View>
  )
}

export default MealSection