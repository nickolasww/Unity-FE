import type React from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { format, addDays, isSameDay } from "date-fns"

interface CalendarStripProps {
  selectedDate: Date
  onDateSelected: (date: Date) => void
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({ selectedDate, onDateSelected }) => {
  const today = new Date()

  // Generate 7 days starting from 3 days ago
  const dates = Array(7)
    .fill(0)
    .map((_, i) => {
      return addDays(today, i - 3)
    })

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
      {dates.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate)
        const dayNumber = format(date, "d")
        const dayName = dayNames[date.getDay()]

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDateSelected(date)}
            className={`mx-2 items-center w-12 ${isSelected ? "" : ""}`}
          >
            <Text className="text-gray-500 text-sm">{dayName}</Text>
            <View
              className={`mt-1 w-10 h-10 rounded-full items-center justify-center
                ${isSelected ? "bg-orange-500 rounded-full" : "bg-transparent rounded-full"}`}
            >
              <Text
                className={`text-xl font-medium
                  ${isSelected ? "text-white" : "text-black"}`}
              >
                {dayNumber}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

export default CalendarStrip