import type React from "react"
import { useState } from "react"
import { View, Text, Modal, TouchableOpacity } from "react-native"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, X } from "lucide-react-native"

interface FullCalendarProps {
  visible: boolean
  onClose: () => void
  selectedDate: Date
  onDateSelected: (date: Date) => void
}

export const FullCalendar: React.FC<FullCalendarProps> = ({ visible, onClose, selectedDate, onDateSelected }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const onMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth(direction === "prev" ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1))
  }

  const renderDays = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

    return (
      <View className="flex-row justify-between mb-2">
        {days.map((day) => (
          <View key={day} className="w-10 items-center">
            <Text className="text-gray-500 font-medium">{day}</Text>
          </View>
        ))}
      </View>
    )
  }

  const renderDates = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const dateRange = eachDayOfInterval({ start: monthStart, end: monthEnd }) // Sudah menggunakan date-fns dengan benar

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const startDay = monthStart.getDay()

    // Create empty slots for days before the first day of the month
    const blanks = Array(startDay).fill(null)

    // Combine blanks and actual dates
    const allDays = [...blanks, ...dateRange]

    // Calculate rows needed (7 days per row)
    const rows = Math.ceil(allDays.length / 7)

    // Create a 2D array of days
    const calendarDays = Array(rows)
      .fill([])
      .map((_, rowIndex) => {
        return allDays.slice(rowIndex * 7, (rowIndex + 1) * 7)
      })

    return (
      <View>
        {calendarDays.map((week, weekIndex) => (
          <View key={`week-${weekIndex}`} className="flex-row justify-between mb-2">
            {week.map((day, dayIndex) => {
              if (!day) {
                // Empty cell
                return <View key={`empty-${dayIndex}`} className="w-10 h-10" />
              }

              const isSelected = isSameDay(day, selectedDate)
              const isToday = isSameDay(day, new Date())

              return (
                <TouchableOpacity
                  key={`day-${day.getTime()}`}
                  className={`w-10 h-10 items-center justify-center rounded-full
                    ${isSelected ? "bg-orange-500" : isToday ? "bg-orange-100" : ""}`}
                  onPress={() => {
                    onDateSelected(day)
                    onClose()
                  }}
                >
                  <Text
                    className={`text-base
                      ${isSelected ? "text-white font-bold" : isToday ? "text-orange-500 font-medium" : "text-black"}`}
                  >
                    {format(day, "d")}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        ))}
      </View>
    )
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-11/12 rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Pilih Tanggal</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={() => onMonthChange("prev")}>
              <ChevronLeft size={24} color="#666" />
            </TouchableOpacity>

            <Text className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</Text>

            <TouchableOpacity onPress={() => onMonthChange("next")}>
              <ChevronRight size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {renderDays()}
          {renderDates()}

          <TouchableOpacity className="mt-4 p-3 bg-orange-500 rounded-lg items-center" onPress={onClose}>
            <Text className="text-white font-medium">Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default FullCalendar