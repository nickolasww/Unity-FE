"use client"

import { useEffect, useState } from "react"
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

// Types for our itinerary data
interface Activity {
  title: string
  description: string
  estimatedCost: string
  estimatedDuration: string
  locationName: string | null
  notes: string
  priority: number
  time: string
}

interface DayItinerary {
  date: string
  day: number
  morningActivities: Activity[]
  afternoonActivities: Activity[]
  eveningActivities: Activity[]
  theme: string
}

interface ItineraryData {
  budget: number
  destination: string
  durationDays: number
  startDate: string
  endDate: string
  itinerary: DayItinerary[]
  preferencesSummary: {
    activities: string[]
    intensity: string
    notes: string | null
    style: string
  }
}

// Sample data - in a real app, this would come from an API or storage
const itineraryData: ItineraryData = {
  budget: 3000000.0,
  destination: "Yogyakarta",
  durationDays: 2,
  endDate: "2025-10-21",
  itinerary: [
    {
      afternoonActivities: [
        {
          description:
            "Nikmati makan siang di Gudeg Yu Djum, salah satu tempat makan gudeg legendaris di Yogyakarta. Ini adalah pengalaman 'Culinary experiences' yang otentik.",
          estimatedCost: "IDR 50k-100k",
          estimatedDuration: "1 jam",
          locationName: "Gudeg Yu Djum Pusat",
          notes: "Buka 06:00-22:00. Cicipi gudeg kering yang manis dan gurih.",
          priority: 1,
          time: "13:00",
          title: "Makan Siang: Gudeg Yu Djum",
        },
        {
          description:
            "Setelah makan siang, berjalan-jalan di Jalan Malioboro, pusat perbelanjaan dan aktivitas kota. Anda bisa mencari oleh-oleh khas Yogyakarta dan menikmati suasana kota. Sesuai dengan preferensi 'Shopping'.",
          estimatedCost: "Free",
          estimatedDuration: "2-3 jam",
          locationName: "Malioboro",
          notes:
            "Banyak pedagang kaki lima dan toko yang menjual batik, kerajinan, dan makanan. Hati-hati dengan barang palsu.",
          priority: 2,
          time: "14:30",
          title: "Jalan Malioboro",
        },
      ],
      date: "2025-10-20",
      day: 1,
      eveningActivities: [
        {
          description:
            "Nikmati makan malam romantis di Bale Raos, restoran yang menyajikan masakan tradisional Keraton Yogyakarta. Pengalaman 'Culinary experiences' yang mewah dan berkesan.",
          estimatedCost: "IDR 150k-300k",
          estimatedDuration: "1-2 jam",
          locationName: "Bale Raos",
          notes: "Reservasi disarankan. Coba Bebek Suwar-Suwir, hidangan favorit Sultan Hamengkubuwono X.",
          priority: 1,
          time: "18:00",
          title: "Makan Malam: Bale Raos",
        },
        {
          description:
            "Jika tertarik, saksikan pertunjukan wayang kulit, seni tradisional Jawa yang mendalam. Ini adalah cara yang baik untuk merasakan 'History & culture'.",
          estimatedCost: "IDR 75k-150k",
          estimatedDuration: "2-3 jam",
          locationName: null,
          notes: "Pertunjukan sering diadakan di berbagai tempat di kota. Cari jadwal dan lokasi yang sesuai.",
          priority: 2,
          time: "20:00",
          title: "Pertunjukan Wayang Kulit (Opsional)",
        },
      ],
      morningActivities: [
        {
          description:
            "Mulai hari dengan mengunjungi Keraton Yogyakarta, pusat pemerintahan dan budaya Jawa. Nikmati arsitektur indah dan pelajari sejarah kerajaan. Cocok untuk Anda yang menyukai 'History & culture'.",
          estimatedCost: "IDR 15k",
          estimatedDuration: "2-3 jam",
          locationName: "Keraton Yogyakarta",
          notes:
            "Buka 08:30-14:00. Hari Jumat tutup. Pertimbangkan untuk menyewa pemandu lokal untuk pengalaman yang lebih mendalam.",
          priority: 1,
          time: "08:00",
          title: "Keraton Yogyakarta",
        },
        {
          description:
            "Setelah Keraton, kunjungi Taman Sari, bekas pemandian kerajaan yang memiliki arsitektur unik dan cerita menarik. Tempat ini sangat romantis dan terkait dengan 'History & culture'.",
          estimatedCost: "IDR 15k",
          estimatedDuration: "1-2 jam",
          locationName: "Taman Sari",
          notes: "Buka 08:00-16:00. Jelajahi lorong-lorong bawah tanah dan kolam pemandiannya.",
          priority: 2,
          time: "11:00",
          title: "Taman Sari",
        },
      ],
      theme: "Yogyakarta: Sejarah, Budaya, dan Romantisme",
    },
    {
      afternoonActivities: [
        {
          description:
            "Nikmati makan siang di Mangut Lele Mbah Marto, tempat makan sederhana yang terkenal dengan mangut lelenya yang pedas dan nikmat. Pengalaman 'Culinary experiences' yang autentik.",
          estimatedCost: "IDR 30k-50k",
          estimatedDuration: "1 jam",
          locationName: "Mangut Lele Mbah Marto",
          notes: "Buka 10:00-16:00. Siap-siap dengan rasa pedasnya!",
          priority: 1,
          time: "13:00",
          title: "Makan Siang: Mangut Lele Mbah Marto",
        },
        {
          description:
            "Kunjungi Desa Seni Kasongan, desa pengrajin gerabah yang terkenal di Yogyakarta. Anda bisa melihat proses pembuatan gerabah dan membeli oleh-oleh unik. Sesuai dengan preferensi 'Shopping' dan 'History & culture'.",
          estimatedCost: "Free",
          estimatedDuration: "2-3 jam",
          locationName: "Kasongan",
          notes: "Buka setiap hari. Tawar harga sebelum membeli.",
          priority: 2,
          time: "14:30",
          title: "Desa Seni Kasongan",
        },
      ],
      date: "2025-10-21",
      day: 2,
      eveningActivities: [
        {
          description:
            "Nikmati matahari terbenam yang indah di Pantai Parangtritis, pantai selatan Yogyakarta yang terkenal dengan ombaknya yang besar dan pasirnya yang hitam. Pengalaman 'Nature exploration' yang romantis.",
          estimatedCost: "IDR 10k",
          estimatedDuration: "2-3 jam",
          locationName: "Pantai Parangtritis",
          notes: "Hati-hati dengan ombaknya yang besar. Jangan berenang terlalu jauh.",
          priority: 1,
          time: "17:30",
          title: "Sunset di Pantai Parangtritis",
        },
        {
          description:
            "Nikmati makan malam terakhir di Sate Klathak Pak Bari, sate kambing yang unik dan lezat. Pengalaman 'Culinary experiences' yang wajib dicoba.",
          estimatedCost: "IDR 50k-100k",
          estimatedDuration: "1-2 jam",
          locationName: "Sate Klathak Pak Bari",
          notes: "Buka 18:30-01:00. Cicipi sate klathak yang disajikan dengan tusuk jeruji sepeda.",
          priority: 2,
          time: "20:00",
          title: "Makan Malam: Sate Klathak Pak Bari",
        },
      ],
      morningActivities: [
        {
          description:
            "Bangun pagi dan saksikan matahari terbit yang spektakuler di Bukit Barede dengan latar belakang Candi Borobudur. Pengalaman 'Nature exploration' yang tak terlupakan.",
          estimatedCost: "IDR 75k-150k (termasuk transportasi)",
          estimatedDuration: "3-4 jam (termasuk perjalanan)",
          locationName: "Bukit Barede",
          notes: "Perlu perjalanan pagi buta. Pesan tur atau transportasi sehari sebelumnya. Buka mulai pukul 04:00.",
          priority: 1,
          time: "07:00",
          title: "Sunrise di Bukit Barede Borobudur (Opsional)",
        },
        {
          description:
            "Kunjungi Candi Borobudur, salah satu keajaiban dunia dan situs warisan UNESCO. Jelajahi relief candi dan pelajari sejarah agama Buddha. Cocok untuk Anda yang menyukai 'History & culture'.",
          estimatedCost: "IDR 50k",
          estimatedDuration: "2-3 jam",
          locationName: "Candi Borobudur",
          notes: "Buka 06:00-17:00. Kenakan pakaian yang sopan.",
          priority: 2,
          time: "11:00",
          title: "Candi Borobudur",
        },
      ],
      theme: "Yogyakarta: Alam, Seni, dan Kenangan",
    },
  ],
  preferencesSummary: {
    activities: ["History & culture", "Culinary experiences", "Nature exploration", "Shopping"],
    intensity: "Balanced",
    notes: null,
    style: "Romantic couple",
  },
  startDate: "2025-10-20",
}

// Helper component for rendering activities
const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityTimeContainer}>
        <Text style={styles.activityTime}>{activity.time}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{activity.title}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>

        <View style={styles.activityDetails}>
          <View style={styles.activityDetail}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.activityDetailText}>{activity.estimatedDuration}</Text>
          </View>
          <View style={styles.activityDetail}>
            <Ionicons name="wallet-outline" size={14} color="#666" />
            <Text style={styles.activityDetailText}>{activity.estimatedCost}</Text>
          </View>
        </View>

        {activity.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>{activity.notes}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

// Helper component for rendering a day's activities
const DayActivities = ({ day }: { day: DayItinerary }) => {
  return (
    <View style={styles.dayContainer}>
      <Text style={styles.dayTitle}>
        Day {day.day} -{" "}
        {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </Text>
      <Text style={styles.dayTheme}>{day.theme}</Text>

      {day.morningActivities.length > 0 && (
        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>Morning</Text>
          {day.morningActivities.map((activity, index) => (
            <ActivityItem key={`morning-${index}`} activity={activity} />
          ))}
        </View>
      )}

      {day.afternoonActivities.length > 0 && (
        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>Afternoon</Text>
          {day.afternoonActivities.map((activity, index) => (
            <ActivityItem key={`afternoon-${index}`} activity={activity} />
          ))}
        </View>
      )}

      {day.eveningActivities.length > 0 && (
        <View style={styles.timeSection}>
          <Text style={styles.timeSectionTitle}>Evening</Text>
          {day.eveningActivities.map((activity, index) => (
            <ActivityItem key={`evening-${index}`} activity={activity} />
          ))}
        </View>
      )}
    </View>
  )
}

const SmartOutput = () => {
  const insets = useSafeAreaInsets()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ItineraryData | null>(null)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(itineraryData)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B2323" />
          <Text style={styles.loadingText}>Loading your itinerary...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#8B2323" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planner</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#8B2323" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Trip Card */}
        <View style={styles.cardContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=2069&auto=format&fit=crop",
            }}
            style={styles.cardBackground}
          />
          <View style={styles.cardContent}>
            <Text style={styles.tripName}>{data?.destination} Trip</Text>
            <Text style={styles.tripDate}>{data ? formatDateRange(data.startDate, data.endDate) : ""}</Text>

            <View style={styles.tagContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{data?.preferencesSummary.style}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Itinerary */}
        <View style={styles.itineraryContainer}>
          <Text style={styles.itineraryTitle}>Your Itinerary</Text>

          {data?.itinerary.map((day, index) => (
            <DayActivities key={`day-${index}`} day={day} />
          ))}
        </View>

        {/* Generate Button */}
        <TouchableOpacity style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate New Plan</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8B2323",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 20,
  },
  cardBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  cardContent: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: 16,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  tripDate: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8B2323",
  },
  tagText: {
    fontSize: 12,
    color: "#8B2323",
  },
  itineraryContainer: {
    marginBottom: 20,
  },
  itineraryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  dayContainer: {
    marginBottom: 24,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dayTheme: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 16,
  },
  timeSection: {
    marginTop: 16,
  },
  timeSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B2323",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  activityItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  activityTimeContainer: {
    width: 50,
    alignItems: "center",
  },
  activityTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#8B2323",
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  activityDetails: {
    flexDirection: "row",
    marginBottom: 8,
  },
  activityDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  activityDetailText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  notesContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 6,
    padding: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#DDD",
  },
  notesText: {
    fontSize: 11,
    color: "#777",
    fontStyle: "italic",
  },
  generateButton: {
    backgroundColor: "#8B2323",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  generateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default SmartOutput