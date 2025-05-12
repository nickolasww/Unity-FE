import type React from "react"
import { View, TouchableOpacity } from "react-native"
import { Calendar } from "lucide-react-native"

interface CalendarIconProps {
  onPress: () => void
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center">
      <View className="w-5 h-5 items-center justify-center">
        <Calendar size={20} color="#666" />
      </View>
    </TouchableOpacity>
  )
}

export default CalendarIcon