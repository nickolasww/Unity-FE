"use client"

import { useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  type ImageSourcePropType,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

// Import local images
// Note: These paths should match your actual project structure
const images = {
  headerImage: require("../../assets/LocalHeader.png"),
  bakpia: require("../../assets/Pia.png"),
  gudeg: require("../../assets/Gudeg.png"),
  borobudur: require("../../assets/Borobudur.png"),
}

// Define the item type
type ItemType = {
  id: string
  name: string
  description: string
  hours: string
  address: string
  image: ImageSourcePropType
  category: string
  details: string
  rating: number
  reviews: number
  location: {
    latitude: number
    longitude: number
  }
}

// Data for listings with local images
const localBusinesses: ItemType[] = [
  {
    id: "1",
    name: "Bakpia Pathok 25",
    description: "Oleh oleh khas Jogja",
    hours: "09:00 - 20:00",
    address: "Jl. Mawar No. 19",
    image: images.bakpia,
    category: "Local Business",
    details:
      "Bakpia Pathok 25 is a famous bakery in Yogyakarta that specializes in bakpia, a traditional Indonesian sweet pastry filled with mung bean paste. It's a must-try local delicacy and perfect as a souvenir.",
    rating: 4.7,
    reviews: 128,
    location: {
      latitude: -7.797068,
      longitude: 110.360791,
    },
  },
]

const localCulinary: ItemType[] = [
  {
    id: "2",
    name: "Gudhed Yu Djum",
    description: "kuliner khas Jogja",
    hours: "09:00 - 20:00",
    address: "Jl. Mawar No. 19",
    image: images.gudeg,
    category: "Local Culinary",
    details:
      "Gudhed Yu Djum is a legendary restaurant in Yogyakarta serving authentic Javanese cuisine. Their specialty is gudeg, a traditional Javanese dish made from young jackfruit stewed for several hours with palm sugar and coconut milk.",
    rating: 4.8,
    reviews: 256,
    location: {
      latitude: -7.803249,
      longitude: 110.36406,
    },
  },
]

const localTours: ItemType[] = [
  {
    id: "3",
    name: "Borobudur Tour",
    description: "3 Hour Tour",
    hours: "By appointment",
    address: "Borobudur Temple",
    image: images.borobudur,
    category: "Local Tour Guide",
    details:
      "Explore the magnificent Borobudur Temple, a 9th-century Mahayana Buddhist temple and the world's largest Buddhist temple. This 3-hour guided tour includes transportation, entrance fees, and an experienced local guide who will explain the history and significance of this UNESCO World Heritage site.",
    rating: 4.9,
    reviews: 312,
    location: {
      latitude: -7.607874,
      longitude: 110.203751,
    },
  },
]

export default function NuTracker() {
  // Use the router from expo-router instead of navigation
  const [selectedLocation, setSelectedLocation] = useState("Yogyakarta")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)

  const locations = ["Yogyakarta", "Bali", "Jakarta", "Bandung", "Surabaya"]

  const navigateToDetail = (item: ItemType) => {
    // Use router.push instead of navigation.navigate
  }

  const renderListingItem = (item: ItemType) => (
    <View key={item.id} style={styles.listingItem}>
      {/* For local images, we don't need the uri property */}
      <Image source={item.image} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle}>{item.name}</Text>
        <Text style={styles.listingDescription}>{item.description}</Text>
        <Text style={styles.listingHours}>{item.hours}</Text>
        <Text style={styles.listingAddress}>{item.address}</Text>
      </View>
      <TouchableOpacity style={styles.detailButton} onPress={() => navigateToDetail(item)}>
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        {/* Header Image - now using local image */}
        <Image source={images.headerImage} style={styles.headerImage} />

        {/* Location Selector */}
        <View style={styles.locationContainer}>
          <Pressable style={styles.locationSelector} onPress={() => setShowLocationDropdown(!showLocationDropdown)}>
            <Ionicons name="location" size={20} color="#8B2323" />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <Ionicons name={showLocationDropdown ? "chevron-up" : "chevron-down"} size={20} color="#8B2323" />
          </Pressable>

          {showLocationDropdown && (
            <View style={styles.dropdown}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedLocation(location)
                    setShowLocationDropdown(false)
                  }}
                >
                  <Text style={[styles.dropdownItemText, location === selectedLocation && styles.selectedLocation]}>
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Local Business Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Business</Text>
          {localBusinesses.map(renderListingItem)}
        </View>

        {/* Local Culinary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Culinary</Text>
          {localCulinary.map(renderListingItem)}
        </View>

        {/* Local Tour Guide Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Tour Guide</Text>
          {localTours.map(renderListingItem)}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  locationContainer: {
    position: "relative",
    zIndex: 10,
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedLocation: {
    color: "#8B2323",
    fontWeight: "600",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8B2323",
    marginBottom: 12,
  },
  listingItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: "hidden",
  },
  listingImage: {
    width: 100,
    height: 110,
  },
  listingContent: {
    flex: 1,
    padding: 10,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  listingDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  listingHours: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  listingAddress: {
    fontSize: 12,
    color: "#888",
  },
  detailButton: {
    backgroundColor: "#8B2323",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginRight: 10,
  },
  detailButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
})
