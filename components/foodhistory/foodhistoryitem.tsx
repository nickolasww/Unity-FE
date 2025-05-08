import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { FoodItem } from "../../utils/foodtypes"

interface FoodHistoryItemProps {
  food: FoodItem
  showAddButton?: boolean
  onAddPress?: () => void
}

export default function FoodHistoryItem({ food, showAddButton = false, onAddPress }: FoodHistoryItemProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-base">{food.name}</Text>

        {showAddButton ? (
          <TouchableOpacity
            className="w-8 h-8 bg-white rounded-full items-center justify-center border border-orange-500"
            onPress={onAddPress}
          >
            <Ionicons name="add" size={20} color="#FF5733" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="w-8 h-8 bg-white rounded-full items-center justify-center border border-orange-500">
            <Ionicons name="add" size={20} color="#FF5733" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row mt-2">
        <View className="bg-red-100 rounded-lg px-3 py-1 mr-3">
          <Text className="text-orange-500">{food.calories} kkal</Text>
        </View>
        <View className="bg-green-100 rounded-lg px-3 py-1">
          <Text className="text-green-500">
            {food.weight} {food.unit}
          </Text>
        </View>
      </View>
    </View>
  )
}
