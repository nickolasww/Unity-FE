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
  hasData?: boolean // Tambahan prop untuk status data
}

export const NutritionBars: React.FC<NutritionBarsProps> = ({ nutritionData, hasData = true }) => {
  const getColorClass = (color: string, hasData: boolean) => {
    // Jika tidak ada data, gunakan warna abu-abu
    if (!hasData) return "bg-gray-300"

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
    // Validasi dan sanitasi input
    const safeCurrent = typeof current === "number" && !isNaN(current) ? current : 0
    const safeTarget = typeof target === "number" && !isNaN(target) && target > 0 ? target : 1

    // Hitung progress dengan validasi
    const progress = safeTarget > 0 ? Math.min(safeCurrent / safeTarget, 1.5) * 100 : 0

    // Tentukan style text berdasarkan status data
    const textStyle = hasData ? "text-black" : "text-gray-500"

    return (
      <View className="mb-2">
        <View className="flex-row justify-between mb-1">
          <Text className={`text-sm ${textStyle}`}>{label}</Text>
          <Text className={`text-sm ${textStyle}`}>
            {safeCurrent}g / {safeTarget}g
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View className={`h-full ${getColorClass(color, hasData)}`} style={{ width: `${progress}%` }} />
        </View>
      </View>
    )
  }

  // Validasi nutritionData dengan fallback values
  const safeNutritionData = {
    carbs: {
      current: nutritionData?.carbs?.current ?? 0,
      target: nutritionData?.carbs?.target ?? 300,
      color: nutritionData?.carbs?.color ?? "purple",
    },
    protein: {
      current: nutritionData?.protein?.current ?? 0,
      target: nutritionData?.protein?.target ?? 120,
      color: nutritionData?.protein?.color ?? "blue",
    },
    fat: {
      current: nutritionData?.fat?.current ?? 0,
      target: nutritionData?.fat?.target ?? 67,
      color: nutritionData?.fat?.color ?? "orange",
    },
    fiber: {
      current: nutritionData?.fiber?.current ?? 0,
      target: nutritionData?.fiber?.target ?? 25,
      color: nutritionData?.fiber?.color ?? "green",
    },
  }

  return (
    <View className="px-2">
      {renderBar(
        "Karbohidrat",
        safeNutritionData.carbs.current,
        safeNutritionData.carbs.target,
        safeNutritionData.carbs.color,
      )}
      {renderBar(
        "Protein",
        safeNutritionData.protein.current,
        safeNutritionData.protein.target,
        safeNutritionData.protein.color,
      )}
      {renderBar("Lemak", safeNutritionData.fat.current, safeNutritionData.fat.target, safeNutritionData.fat.color)}
      {renderBar(
        "Serat",
        safeNutritionData.fiber.current,
        safeNutritionData.fiber.target,
        safeNutritionData.fiber.color,
      )}
    </View>
  )
}

export default NutritionBars
