import type React from "react"
import { View, Text } from "react-native"
import Svg, { Circle } from "react-native-svg"

interface NutritionCircleProps {
  current: number
  target: number
}

export const NutritionCircle: React.FC<NutritionCircleProps> = ({ current, target }) => {
  const radius = 40
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / target, 1.5) // Cap at 150% for visual purposes
  const strokeDashoffset = circumference - progress * circumference

  return (
    <View className="items-center justify-center">
      <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
        {/* Background Circle */}
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="#f0f0f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <Circle
          cx={radius + strokeWidth / 2}
          cy={radius + strokeWidth / 2}
          r={radius}
          stroke="#FF5733"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${radius + strokeWidth / 2}, ${radius + strokeWidth / 2})`}
        />
      </Svg>

      <View className="absolute items-center">
        <Text className="text-3xl font-bold text-orange-500">{current.toLocaleString()}</Text>
        <Text className="text-xs text-gray-500">/{target.toLocaleString()} kkal</Text>
      </View>
    </View>
  )
}

export default NutritionCircle