import type React from "react"
import { View, Text } from "react-native"
import Svg, { Circle } from "react-native-svg"

interface NutritionCircleProps {
  current: number
  target: number
  hasData?: boolean 
}

export const NutritionCircle: React.FC<NutritionCircleProps> = ({
  current = 0, // Default value
  target = 0, // Default value
  hasData = true,
}) => {
  const radius = 40
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius

  // Validasi input untuk mencegah NaN atau Infinity
  const safeCurrent = typeof current === "number" && !isNaN(current) ? current : 0
  const safeTarget = typeof target === "number" && !isNaN(target) && target > 0 ? target : 2000

  // Hitung progress dengan batas maksimal 100% (1.0)
  // Jika current >= target, maka progress = 1 (lingkaran penuh)
  const progress = safeTarget > 0 ? Math.min(safeCurrent / safeTarget, 1.0) : 0
  const strokeDashoffset = circumference - progress * circumference

  // Cek apakah sudah melebihi target
  const isExceeded = safeCurrent > safeTarget

  // Tentukan warna berdasarkan status data dan apakah melebihi target
  let strokeColor = "#e0e0e0" 
  let textColor = "text-gray-400"

  if (hasData) {
    if (isExceeded) {
      // Jika melebihi target, gunakan warna merah/warning
      strokeColor = "#EF4444" 
      textColor = "text-red-500"
    } else {
      // Jika belum melebihi target, gunakan warna orange normal
      strokeColor = "#FF5733"
      textColor = "text-orange-500"
    }
  }

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
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${radius + strokeWidth / 2}, ${radius + strokeWidth / 2})`}
        />

        {hasData && isExceeded && (
          <Circle
            cx={radius + strokeWidth / 2}
            cy={radius + strokeWidth / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={2}
            strokeDasharray="4 4" 
            fill="transparent"
            opacity={0.6}
            transform={`rotate(-90, ${radius + strokeWidth / 2}, ${radius + strokeWidth / 2})`}
          />
        )}
      </Svg>

      <View className="absolute items-center ">
        <Text className={`text-3xl font-bold ${textColor}`}>{safeCurrent.toLocaleString()}</Text>
        <Text className="text-xs text-gray-500">/{safeTarget.toLocaleString()} kkal</Text>
      </View>
    </View>
  )
}

export default NutritionCircle
