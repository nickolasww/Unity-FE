import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface MealSelectorProps {
  selectedMeal: string
  showOptions: boolean
  options: string[]
  onToggleOptions: () => void
  onSelectMeal: (meal: string) => void
}

export const MealSelector: React.FC<MealSelectorProps> = ({
  selectedMeal,
  showOptions,
  options,
  onToggleOptions,
  onSelectMeal,
}) => {
  return (
    <View className="relative mb-4">
      <TouchableOpacity
        className="border border-orange-500 rounded-full px-4 py-2 flex-row items-center justify-between"
        style={{ width: 130 }}
        onPress={onToggleOptions}
      >
        <Text className="text-orange-500 mr-2">{selectedMeal}</Text>
        <Ionicons name={showOptions ? "chevron-up" : "chevron-down"} size={16} color="#FF5733" />
      </TouchableOpacity>

      {showOptions && (
        <View className="absolute top-12 left-0 bg-white rounded-lg shadow-md z-10 w-40">
          {options.map((meal) => (
            <TouchableOpacity
              key={meal}
              className="px-4 py-2 border-b border-gray-100"
              onPress={() => onSelectMeal(meal)}
            >
              <Text>{meal}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
