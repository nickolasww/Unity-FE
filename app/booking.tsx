"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Dimensions } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

// Get screen dimensions
const { width } = Dimensions.get("window")

// Days of the week
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

// Sample data for booked dates
const BOOKED_DATES = ["11", "12", "13", "14"]

export default function BookingScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { name, price = "100000" } = params

  // State for selected date
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState("Maret 2025")

  // Calculate subtotal and total
  const subtotal = Number.parseInt(price as string, 10)
  const discount = 0
  const total = subtotal - discount

  // Generate calendar days
  const generateDays = () => {
    // In a real app, you would calculate this based on the actual month
    const days = []
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString())
    }
    return days
  }

  const days = generateDays()

  // Handle date selection
  const selectDate = (day: string) => {
    if (BOOKED_DATES.includes(day)) return
    setSelectedDate(day)
  }

  // Handle checkout
  const handleCheckout = () => {
    if (!selectedDate) {
      // In a real app, show an error message
      return
    }

    // Navigate to confirmation screen with booking details
    router.push({
      pathname: "/booking-confirm",
      params: {
        name,
        date: `${selectedDate} ${currentMonth}`,
        price: total.toString(),
      },
    })
  }

  // Navigate to previous month
  const previousMonth = () => {
    // In a real app, you would implement actual month navigation
    setCurrentMonth("Februari 2025")
  }

  // Navigate to next month
  const nextMonth = () => {
    // In a real app, you would implement actual month navigation
    setCurrentMonth("April 2025")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8B2323" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Tour Info Card */}
        <View style={styles.tourCard}>
          <Text style={styles.tourName}>{name || "Borobudur Tour 2 Hours"}</Text>
          <View style={styles.nonRefundableContainer}>
            <Text style={styles.nonRefundableText}>Non-refundable</Text>
            <Text style={styles.nonRefundableDescription}>You can not refund your payment when you cancel</Text>
          </View>
        </View>

        {/* Travel Dates Section */}
        <Text style={styles.sectionTitle}>Travel Dates</Text>

        <View style={styles.calendarCard}>
          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={previousMonth}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.monthText}>{currentMonth}</Text>
            <TouchableOpacity onPress={nextMonth}>
              <Ionicons name="chevron-forward" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Days of Week */}
          <View style={styles.daysOfWeek}>
            {DAYS.map((day) => (
              <Text key={day} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {days.map((day) => {
              const isBooked = BOOKED_DATES.includes(day)
              const isSelected = selectedDate === day

              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayButton, isBooked && styles.bookedDay, isSelected && styles.selectedDay]}
                  onPress={() => selectDate(day)}
                  disabled={isBooked}
                >
                  <Text
                    style={[styles.dayText, isBooked && styles.bookedDayText, isSelected && styles.selectedDayText]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <Text style={styles.legendTextBooked}>FULLED BOOKED</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendTextAvailable}>AVAILABLE</Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <Text style={styles.sectionTitle}>Payment Summary</Text>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rp {subtotal.toLocaleString()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount Total</Text>
            <Text style={styles.summaryValue}>Rp {discount.toLocaleString()}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>Rp {total.toLocaleString()}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[styles.checkoutButton, !selectedDate && styles.disabledButton]}
          onPress={handleCheckout}
          disabled={!selectedDate}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B2323",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  tourCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tourName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  nonRefundableContainer: {
    marginTop: 4,
  },
  nonRefundableText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E53935",
  },
  nonRefundableDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  calendarCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: "600",
  },
  daysOfWeek: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayOfWeekText: {
    width: (width - 64) / 7,
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayButton: {
    width: (width - 64) / 7,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  bookedDay: {
    opacity: 0.5,
  },
  bookedDayText: {
    color: "#E53935",
  },
  selectedDay: {
    backgroundColor: "#8B2323",
    borderRadius: 20,
  },
  selectedDayText: {
    color: "white",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendTextBooked: {
    fontSize: 12,
    color: "#E53935",
    fontWeight: "500",
  },
  legendTextAvailable: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  summaryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#333",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B2323",
  },
  checkoutButton: {
    backgroundColor: "#8B2323",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
