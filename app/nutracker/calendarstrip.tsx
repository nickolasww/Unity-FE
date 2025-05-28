import type React from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { format, addDays, isSameDay, isFuture } from "date-fns"

interface CalendarStripProps {
  selectedDate: Date
  onDateSelected: (date: Date) => void
  availableDates?: Date[] // Add this prop to track available dates
}

export const CalendarStrip: React.FC<CalendarStripProps> = ({
  selectedDate,
  onDateSelected,
  availableDates = [], // Default to empty array if not provided
}) => {
  const today = new Date()

  // Generate 7 days starting from 3 days ago
  const dates = Array(7)
    .fill(0)
    .map((_, i) => {
      return addDays(today, i - 3)
    })

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  // Check if a date is available (has data)
  const isDateAvailable = (date: Date) => {
    // In a real app, you would check if this date has data
    // For now, we'll just check if it's in the availableDates array or if it's today
    return availableDates.some((availableDate) => isSameDay(availableDate, date)) || isSameDay(date, today)
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
      {dates.map((date, index) => {
        const isSelected = isSameDay(date, selectedDate)
        const dayNumber = format(date, "d")
        const dayName = dayNames[date.getDay()]
        const isFutureDate = isFuture(date)
        const isAvailable = isDateAvailable(date)

        // Determine if the date should be disabled
        const isDisabled = isFutureDate || !isAvailable

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!isDisabled) {
                onDateSelected(date)
              }
            }}
            disabled={isDisabled}
            className={`mx-2 items-center w-12 ${isDisabled ? "opacity-30" : ""}`}
          >
            <Text className={`text-gray-500 text-sm ${isDisabled ? "text-gray-300" : ""}`}>{dayName}</Text>
            <View
              className={`mt-1 w-10 h-10 rounded-full items-center justify-center
                ${isSelected ? "bg-orange-500 rounded-full" : "bg-transparent rounded-full"}
                ${isDisabled ? "bg-gray-100" : ""}`}
            >
              <Text
                className={`text-xl font-medium
                  ${isSelected ? "text-white" : "text-black"}
                  ${isDisabled ? "text-gray-400" : ""}`}
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
