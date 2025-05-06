"use client"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, Image } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"


export default function BookingConfirmationScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { name, date } = params
  const formattedDate = date ? String(date).replace("Maret", "March") : "19 September 2025"

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/localconnect")} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8B2323" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark" size={32} color="white" />
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Booking Successful</Text>
        <Text style={styles.successSubtitle}>Booking confirmed!</Text>
        <Text style={styles.tourName}>{name || "Borobudur Tour Entrance Ticket"}</Text>

        {/* Invoice Card */}
        <View style={styles.invoiceCard}>
          <Text style={styles.invoiceTitle}>Invoice</Text>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceLabel}>Ticket Info</Text>
            <Text style={styles.invoiceValue}>{name || "Borobudur Tour"}</Text>
          </View>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceLabel}>Date</Text>
            <Text style={styles.invoiceValue}>{formattedDate}</Text>
          </View>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceLabel}>Guest</Text>
            <Text style={styles.invoiceValue}>1 Adults</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  successIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#8B2323",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  tourName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 32,
  },
  invoiceCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  invoiceSection: {
    marginBottom: 16,
  },
  invoiceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  invoiceValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  barcode: {
    width: "100%",
    height: 80,
    marginTop: 16,
  },
  downloadButton: {
    flexDirection: "row",
    backgroundColor: "#8B2323",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  downloadButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  homeButton: {
    borderWidth: 1,
    borderColor: "#8B2323",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
  },
  homeButtonText: {
    color: "#8B2323",
    fontSize: 16,
    fontWeight: "600",
  },
})
