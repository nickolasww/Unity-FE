import type React from "react"
import { View, Text } from "react-native"

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

interface NutritionBarsProps {
  nutritionData: NutritionData
}

export const NutritionBars: React.FC<NutritionBarsProps> = ({ nutritionData }) => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-500"
      case "blue":
        return "bg-blue-500"
      case "orange":
        return "bg-orange-500"
      case "green":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderBar = (label: string, current: number, target: number, color: string) => {
    const progress = Math.min(current / target, 1.5) * 100 // Cap at 150% for visual purposes

    return (
      <View className="mb-2">
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm">{label}</Text>
          <Text className="text-sm">
            {current}g / {target}g
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View className={`h-full ${getColorClass(color)}`} style={{ width: `${progress}%` }} />
        </View>
      </View>
    )
  }

  return (
    <View className="px-2">
      {renderBar("Karbohidrat", nutritionData.carbs.current, nutritionData.carbs.target, nutritionData.carbs.color)}
      {renderBar("Protein", nutritionData.protein.current, nutritionData.protein.target, nutritionData.protein.color)}
      {renderBar("Lemak", nutritionData.fat.current, nutritionData.fat.target, nutritionData.fat.color)}
      {renderBar("Serat", nutritionData.fiber.current, nutritionData.fiber.target, nutritionData.fiber.color)}
    </View>
  )
}

export default NutritionBars
