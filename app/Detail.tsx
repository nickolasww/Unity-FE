"use client"
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"

// Sample reviews data
const sampleReviews = [
  {
    id: 1,
    name: "Nadya",
    date: "6 months ago",
    comment: "Bakpia Yang Paling Enak, Lembut, No Effort Makannya",
    rating: 5.0,
  },
  {
    id: 2,
    name: "Raihani",
    date: "6 months ago",
    comment: "Bakpianya Enak, Harganya Terjangkau Juga, Kalau Ke Jogja Pasti Beli",
    rating: 5.0,
  },
  {
    id: 3,
    name: "Echa",
    date: "6 months ago",
    comment: "Banyak Variasi Rasa, Tapi Paling Suka Original Nya",
    rating: 5.0,
  },
  {
    id: 4,
    name: "Ghaniya",
    date: "6 months ago",
    comment: "Bakpianya Sangat Enak Nom Nom",
    rating: 5.0,
  },
]

// Sample overview texts
const overviewTexts = {
  "1": `Bakpia Pathok is a well-known traditional snack from Yogyakarta, Indonesia. These small, round pastries are typically filled with sweet mung bean paste and wrapped in a soft, flaky dough. The combination of the slightly crispy outer layer and the smooth, sweet filling makes Bakpia a favorite treat among locals and tourists alike. Originally influenced by Chinese pastry, it has become uniquely Javanese over the years.

Today, Bakpia Pathok comes in a variety of modern flavors such as chocolate, cheese, green tea, and even durian, appealing to a wider audience. It is often packed in boxes and brought home as a signature souvenir from Yogyakarta. Whether enjoyed with tea or given as a gift, Bakpia Pathok represents the warmth, creativity, and rich culinary heritage of Indonesia.`,
  "2": `Gudeg Yu Djum is one of Yogyakarta's most iconic culinary establishments, famous for its traditional Javanese dish called gudeg. This legendary restaurant has been serving authentic gudeg for generations, maintaining the original recipe that has captivated both locals and tourists.

The signature dish is made from young jackfruit (nangka muda) that is stewed for hours with palm sugar, coconut milk, and various traditional spices. The slow cooking process results in a sweet and savory flavor that is uniquely Javanese. Gudeg is typically served with rice, krecek (spicy cow skin), ayam suwir (shredded chicken), telur pindang (boiled egg in sweet sauce), and areh (thick coconut milk).

Yu Djum's gudeg stands out for its perfect balance of flavors and consistent quality that has been maintained for decades, making it a must-visit culinary destination in Yogyakarta.`,
  "3": `A Borobudur Tour takes you to the heart of Java's cultural and spiritual heritage. Standing tall since the 9th century, Borobudur Temple is the world's largest Buddhist monument, featuring stunning stone carvings and hundreds of stupas. The highlight of the trip is watching the sunrise from the top of the temple—an awe-inspiring moment as light slowly reveals the beauty of the surrounding mountains and misty forests.

Beyond its majestic architecture, a visit to Borobudur offers a deeper connection to Indonesia's past and traditions. Travelers can walk through the temple's levels, each telling a story through intricate reliefs, and learn about the philosophy and history behind it. Surrounded by peaceful countryside and friendly locals, the Borobudur Trip is both a cultural journey and a spiritual escape.`,
}

export default function DetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState("Overview")

  // Extract params
  const { id, name, description, hours, address, image, category, details, rating, reviews } = params

  // Determine if this is a tour that should show the booking button
  const showBookButton = id === "3" // Only show for Borobudur Tour (id: 3)

  // Get the correct location text
  const locationText = "Kab. Bantul, D.I. Yogyakarta"

  // Handle the image based on the id
  let imageSource
  switch (id) {
    case "1":
      imageSource = require("../assets/Pia.png")
      break
    case "2":
      imageSource = require("../assets/Gudeg.png")
      break
    case "3":
      imageSource = require("../assets/Borobudur.png")
      break
    default:
      imageSource = require("../assets/LocalHeader.png")
  }

  // Get overview text based on id
  const overviewText = overviewTexts[id as string] || details

  const handleBooking = () => {
    router.push({
      pathname: "/booking",
      params: {
        name: name || "Borobudur Tour 2 Hours",
        price: "100000", // Default price, could be dynamic
      },
    })
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.mainImage} />

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Route Badge */}
          <View style={styles.routeBadge}>
            <Ionicons name="map" size={16} color="white" />
            <Text style={styles.routeText}>Route</Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title and Location */}
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.location}>{locationText}</Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Overview" && styles.activeTab]}
              onPress={() => setActiveTab("Overview")}
            >
              <Text style={styles.tabText}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Reviews" && styles.activeTab]}
              onPress={() => setActiveTab("Reviews")}
            >
              <Text style={styles.tabText}>Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "Overview" ? (
            <View style={styles.tabContent}>
              <Text style={styles.overviewText}>{overviewText}</Text>

              {/* Book Button - Only for tours */}
              {showBookButton && (
                <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                  <Text style={styles.bookButtonText}>Book Ticket</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.tabContent}>
              <Text style={styles.reviewsCount}>Reviews (900)</Text>

              {/* Reviews List */}
              {sampleReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    
                    <View style={styles.reviewHeaderText}>
                      <Text style={styles.reviewerName}>{review.name}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons key={star} name="star" size={16} color="#FFD700" />
                    ))}
                    <Text style={styles.ratingText}> {review.rating}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  mainImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  routeBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "#C22121",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  routeText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  contentCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 55,
    marginRight: 16,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#8B2323",
    
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabContent: {
    paddingVertical: 8,
  },
  overviewText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
    textAlign: "justify",
  },
  bookButton: {
    backgroundColor: "#8B2323",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewsCount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 12,
    color: "#888",
  },
  reviewComment: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
})
