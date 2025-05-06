"use client"
import { useState } from "react"
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import LoadingOverlay from "../components/loading/loadingoverlay"

export default function SmartInput() {
  const router = useRouter()
  const [destination, setDestination] = useState("Yogyakarta")
  const [selectedDates, setSelectedDates] = useState([19, 20])
  const [selectedActivities, setSelectedActivities] = useState(["Family"])
  const [budget, setBudget] = useState("Rp 500,000")
  const [selectedTravelStyle, setSelectedTravelStyle] = useState(["Family with children"])
  const [selectedIntensity, setSelectedIntensity] = useState(["Balanced"])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Generating your plan...")
  const [loadingStage, setLoadingStage] = useState(0)

  // Loading messages for different stages
  const loadingMessages = [
    "Generating your plan...",
    "Finding the best attractions...",
    "Planning your itinerary...",
    "Calculating costs...",
    "Finalizing your perfect trip...",
  ]

  const toggleActivity = (activity) => {
    if (selectedActivities.includes(activity)) {
      setSelectedActivities(selectedActivities.filter((item) => item !== activity))
    } else {
      setSelectedActivities([...selectedActivities, activity])
    }
  }

  const toggleTravelStyle = (style) => {
    if (selectedTravelStyle.includes(style)) {
      setSelectedTravelStyle(selectedTravelStyle.filter((item) => item !== style))
    } else {
      setSelectedTravelStyle([...selectedTravelStyle, style])
    }
  }

  const toggleIntensity = (intensity) => {
    if (selectedIntensity.includes(intensity)) {
      setSelectedIntensity(selectedIntensity.filter((item) => item !== intensity))
    } else {
      setSelectedIntensity([...selectedIntensity, intensity])
    }
  }

  // Simulate API call with loading stages
  const generatePlan = async () => {
    // Validate form
    if (!destination) {
      Alert.alert("Missing Information", "Please enter a travel destination")
      return
    }

    if (selectedDates.length === 0) {
      Alert.alert("Missing Information", "Please select travel dates")
      return
    }

    if (selectedActivities.length === 0) {
      Alert.alert("Missing Information", "Please select at least one activity preference")
      return
    }

    setIsLoading(true)
    setLoadingStage(0)
    setLoadingMessage(loadingMessages[0])

    try {
      // Simulate API call with multiple loading stages
      for (let i = 1; i < loadingMessages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Wait 1.5 seconds between stages
        setLoadingStage(i)
        setLoadingMessage(loadingMessages[i])
      }

      // Simulate API response
      const mockApiResponse = {
        destination: destination,
        start_date: "2025-09-19",
        end_date: "2025-09-20",
        travel_style: selectedTravelStyle[0],
        itinerary: [
          {
            activities: [
              {
                time: "09.00",
                name: "Tamasya Keraton Yogjakarta",
                description: "Kunjungi keraton Yogjakarta, Istana Sultan yang menjadi pusat budaya Jawa",
                notes:
                  "Datang ke Keraton Jogja pagi saat suasana masih sejuk dan belum terlalu ramai. Cocok untuk menikmati suasana budaya dengan lebih tenang.",
                duration: "2 - 3 jam",
                price_range: { min: 15000, max: 15000 },
              },
              {
                time: "13.00",
                name: "Makan Siang, Seafood Parangtritis",
                description: "Nikmati hidangan laut segar di salah satu warung makan di sepanjang Pantai Parangtritis",
                notes: "Pilih warung makan yang ramai dikunjungi untuk memastikan kesegaran makanan.",
                duration: "1 - 2 jam",
                price_range: { min: 75000, max: 150000 },
              },
              {
                time: "18.00",
                name: "Makan Malam, House of Raminten",
                description: "Nikmati makan malam dengan suasana Jawa yang kental dan hidangan tradisional yang lezat.",
                notes: "Pilih warung makan yang ramai dikunjungi untuk memastikan kesegaran makanan.",
                duration: "1 - 2 jam",
                price_range: { min: 150000, max: 300000 },
              },
            ],
          },
          {
            activities: [
              {
                time: "09.00",
                name: "Tamasya Keraton Yogjakarta",
                description: "Nikmati hidangan laut segar di salah satu warung makan di sepanjang Pantai Parangtritis",
                notes:
                  "Datang ke Keraton Jogja pagi saat suasana masih sejuk dan belum terlalu ramai. Cocok untuk menikmati suasana budaya dengan lebih tenang.",
                duration: "2 - 3 jam",
                price_range: { min: 15000, max: 15000 },
              },
              {
                time: "13.00",
                name: "Makan Siang, Seafood Parangtritis",
                description: "Nikmati hidangan laut segar di salah satu warung makan di sepanjang Pantai Parangtritis",
                notes: "Pilih warung makan yang ramai dikunjungi untuk memastikan kesegaran makanan.",
                duration: "1 - 2 jam",
                price_range: { min: 75000, max: 150000 },
              },
              {
                time: "18.00",
                name: "Makan Malam, House of Raminten",
                description: "Nikmati makan malam dengan suasana Jawa yang kental dan hidangan tradisional yang lezat.",
                notes: "Pilih warung makan yang ramai dikunjungi untuk memastikan kesegaran makanan.",
                duration: "1 - 2 jam",
                price_range: { min: 150000, max: 300000 },
              },
            ],
          },
        ],
      }

      // Store the mock response in AsyncStorage
      await AsyncStorage.setItem("tripPlan", JSON.stringify(mockApiResponse))

      // Navigate to the results screen
      router.push("/smarthistory")
    } catch (error) {
      Alert.alert("Error", "Failed to generate plan. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderCalendar = () => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const daysInMonth = 30 // September 2025 has 30 days

    // Calculate the day of the week for September 1, 2025 (0 = Sunday, 1 = Monday, etc.)
    // September 1, 2025 is a Monday (1)
    const startDayOfWeek = 1

    // Create array for empty cells before the first day of the month
    const emptyCells = Array(startDayOfWeek).fill(null)

    // Create array for all days in the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Combine empty cells and days
    const calendarCells = [...emptyCells, ...daysArray]

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.monthSelector}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="#555555" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>September 2025</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color="#555555" />
          </TouchableOpacity>
        </View>

        <View style={styles.daysHeader}>
          {days.map((day) => (
            <Text key={day} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.datesContainer}>
          {calendarCells.map((date, index) => {
            if (date === null) {
              // Empty cell
              return <View key={`empty-${index}`} style={styles.dateCell} />
            }

            const isSelected = selectedDates.includes(date)

            return (
              <TouchableOpacity
                key={date}
                style={[styles.dateCell, isSelected && styles.selectedDateCell]}
                onPress={() => {
                  if (isSelected) {
                    setSelectedDates(selectedDates.filter((d) => d !== date))
                  } else {
                    setSelectedDates([...selectedDates, date])
                  }
                }}
              >
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>{date}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8B2323" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Smart Planner</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Travel Destination</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex. Malang, Bali"
            value={destination}
            onChangeText={setDestination}
          />
          <Ionicons name="chevron-down" size={24} color="#8B2323" style={styles.inputIcon} />
        </View>

        <Text style={styles.sectionTitle}>Travel Dates</Text>
        {renderCalendar()}

        <Text style={styles.sectionTitle}>Activity Preferences</Text>
        <View style={styles.chipsContainer}>
          {["Nature Exploration", "History & culture", "Culinary", "Shopping", "Family"].map((activity) => (
            <TouchableOpacity
              key={activity}
              style={[styles.chip, selectedActivities.includes(activity) && styles.selectedChip]}
              onPress={() => toggleActivity(activity)}
            >
              <Text style={[styles.chipText, selectedActivities.includes(activity) && styles.selectedChipText]}>
                {activity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Travel Budget</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ex. Rp 250,000"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
        </View>

        <Text style={styles.sectionTitle}>Travel Style</Text>
        <View style={styles.chipsContainer}>
          {["Solo Traveler", "Romantic couple", "Family with children", "Backpacker", "Luxury Traveler"].map(
            (style) => (
              <TouchableOpacity
                key={style}
                style={[styles.chip, selectedTravelStyle.includes(style) && styles.selectedChip]}
                onPress={() => toggleTravelStyle(style)}
              >
                <Text style={[styles.chipText, selectedTravelStyle.includes(style) && styles.selectedChipText]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <Text style={styles.sectionTitle}>Activity Intensity</Text>
        <View style={styles.chipsContainer}>
          {["Relaxed", "Balanced", "Full"].map((intensity) => (
            <TouchableOpacity
              key={intensity}
              style={[styles.chip, selectedIntensity.includes(intensity) && styles.selectedChip]}
              onPress={() => toggleIntensity(intensity)}
            >
              <Text style={[styles.chipText, selectedIntensity.includes(intensity) && styles.selectedChipText]}>
                {intensity}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={generatePlan} disabled={isLoading}>
          <Text style={styles.generateButtonText}>Generate Plan</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      <LoadingOverlay visible={isLoading} message={loadingMessage} type="custom" />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8B2323",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555555",
    marginTop: 16,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: "center",
    position: "relative",
  },
  input: {
    fontSize: 16,
    color: "#333333",
  },
  inputIcon: {
    position: "absolute",
    right: 16,
  },
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dayLabel: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    color: "#999999",
  },
  datesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateCell: {
    width: "14.28%",
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  selectedDateCell: {
    backgroundColor: "#FFF5F5",
    borderRadius: 18,
  },
  dateText: {
    fontSize: 14,
    color: "#333333",
  },
  selectedDateText: {
    color: "#8B2323",
    fontWeight: "600",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    borderColor: "#8B2323",
    backgroundColor: "#FFF5F5",
  },
  chipText: {
    fontSize: 14,
    color: "#555555",
  },
  selectedChipText: {
    color: "#8B2323",
  },
  generateButton: {
    backgroundColor: "#8B2323",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
