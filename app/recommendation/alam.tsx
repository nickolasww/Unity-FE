"use client"

import { useState } from "react"
import { ScrollView, View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Link, router } from "expo-router"

const { width } = Dimensions.get("window")

interface Attraction {
  id: string
  name: string
  location: string
  description: string
  image: any
  rating: number
}

export default function Alam({ navigation }) {
  const [activeFilter, setActiveFilter] = useState("All")

  const attractions: Attraction[] = [
    {
      id: "1",
      name: "Taman Sari",
      location: "Kota Yogyakarta, D.I. Yogyakarta",
      description:
        "Taman Sari, also known as the Water Castle, is a historical site located in Yogyakarta, Indonesia. Built in the mid-18...",
      image: "",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Prambanan Temple",
      location: "Kota Yogyakarta, D.I. Yogyakarta",
      description:
        "Prambanan Temple is a majestic 9th-century Hindu temple complex located in Yogyakarta, Indonesia. Dedicated to the...",
      image:"",
      rating: 4.8,
    },
    {
      id: "3",
      name: "Parangtritis Beach",
      location: "Kab. Bantul, D.I. Yogyakarta",
      description:
        "Parangtritis Beach is a popular coastal destination in Yogyakarta, Indonesia, known for its stunning sunset views, rollin...",
      image: "",
      rating: 4.8,
    },
    {
      id: "4",
      name: "Siung Beach",
      location: "Kab. Gunungkidul, D.I. Yogyakarta",
      description:
        "Siung Beach is a popular coastal destination in Yogyakarta, Indonesia, known for its stunning sunset views, rollin... See",
      image: "",
      rating: 4.8,
    },
  ]

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#762727" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommendation</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, activeFilter === "All" && styles.activeFilterTab]}
          onPress={() => setActiveFilter("All")}
        >
          <Text style={[styles.filterText, activeFilter === "All" && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, activeFilter === "Culture Sync" && styles.activeFilterTab, styles.outlineFilterTab]}
          onPress={() => setActiveFilter("Culture Sync")}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === "Culture Sync" && styles.activeFilterText,
              { color: "#762727" },
            ]}
          >
            Culture Sync
          </Text>
        </TouchableOpacity>
      </View>

      {/* Attractions List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {attractions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.attractionCard}
            onPress={() => {
              // Navigate to detail screen
              // navigation.navigate('AttractionDetail', { attraction: item });
            }}
          >
            <Image source={item.image} style={styles.attractionImage} resizeMode="cover" />
            <View style={styles.attractionInfo}>
              <View>
                <Text style={styles.attractionName}>{item.name}</Text>
                <Text style={styles.attractionLocation}>{item.location}</Text>
                <Text style={styles.attractionDescription}>{item.description}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#C93C3C" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add some bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#762727",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilterTab: {
    backgroundColor: "#762727",
  },
  outlineFilterTab: {
    borderWidth: 1,
    borderColor: "#762727",
  },
  filterText: {
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  attractionCard: {
    marginVertical: 10,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  attractionImage: {
    width: "100%",
    height: 150,
  },
  attractionInfo: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  attractionName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  attractionLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  attractionDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    width: width - 100,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: "bold",
    color: "#C93C3C",
  },
})
