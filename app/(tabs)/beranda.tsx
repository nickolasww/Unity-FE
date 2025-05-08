import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Link, router } from "expo-router";

// Main App Component
export default function beranda() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Main Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <Header />

        {/* Featured Cards */}
        <FeaturedCards />

        {/* Recommendation Section */}
        <SectionHeader title="Recommendation For You" />
        <RecommendationCards />

        {/* Best Deals Section */}
        <SectionHeader title="Best Deal For You" />
        <BestDealCards />

        {/* Bottom padding for scrolling past the navigation bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

// Header Component with Search Bar
const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("../../assets/Header.png")}
        style={styles.headerImage}
      />

      {/* Menu Button */}
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#762727" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search for a place to go..." placeholderTextColor="#999" />
        </View>
      </View>
    </View>
  )
}

// Featured Cards Component
const FeaturedCards = () => {
  const featuredData = [
    {
      id: "1",
      title: "CELEBRATE INDONESIAN DIVERSITY",
      image: require("../../assets/Celebrate.png"),
      buttonText: "START EXPLORE",
    },
    {
      id: "2",
      title: "EMBRACE CULTURAL HERITAGE",
      image: require("../../assets/Embrace.png"),
      buttonText: "DISCOVER NOW",
    },
    {
      id: "3",
      title: "NATURAL WONDERS",
      image: "",
      buttonText: "EXPLORE",
    },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredContainer}>
      {featuredData.map((item) => (
        <FeaturedCard key={item.id} title={item.title} image={item.image} buttonText={item.buttonText} />
      ))}
    </ScrollView>
  )
}

// Individual Featured Card
const FeaturedCard = ({ title, image, buttonText }) => {
  return (
    <ImageBackground source={image} style={styles.featuredCard} imageStyle={styles.featuredCardImage}>
      <View style={styles.featuredCardOverlay}>
        <Text style={styles.featuredCardTitle}>{title}</Text>
        <TouchableOpacity style={styles.featuredCardButton}>
          <Text style={styles.featuredCardButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

// Section Header Component
const SectionHeader = ({ title }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={() => router.push("/recommendation/alam")}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
  )
}

// Recommendation Cards Component
const RecommendationCards = () => {
  const recommendationData = [
    {
      id: "1",
      name: "Taman Sari",
      category: "History",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Prambanan Temple",
      category: "History",
      rating: 5,
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Borobudur",
      category: "History",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop",
    },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
      {recommendationData.map((item) => (
        <DestinationCard
          key={item.id}
          name={item.name}
          category={item.category}
          rating={item.rating}
          image={item.image}
        />
      ))}
    </ScrollView>
  )
}

// Best Deal Cards Component
const BestDealCards = () => {
  const bestDealData = [
    {
      id: "1",
      name: "Bali Beach",
      category: "Beach",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Raja Ampat",
      category: "History",
      rating: 5,
      image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Komodo Island",
      category: "Nature",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop",
    },
  ]

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsContainer}>
      {bestDealData.map((item) => (
        <DestinationCard
          key={item.id}
          name={item.name}
          category={item.category}
          rating={item.rating}
          image={item.image}
        />
      ))}
    </ScrollView>
  )
}

// Destination Card Component
const DestinationCard = ({ name, category, rating, image }) => {
  // Generate star rating
  const renderStars = () => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={14} color="#FFD700" />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half-star" name="star-half" size={14} color="#FFD700" />)
    }

    const remainingStars = 5 - stars.length
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Ionicons key={`empty-star-${i}`} name="star-outline" size={14} color="#FFD700" />)
    }

    return stars
  }

  return (
    <TouchableOpacity style={styles.destinationCard}>
      <Image source={{ uri: image }} style={styles.destinationImage} />
      <View style={styles.destinationInfo}>
        <Text style={styles.destinationName}>{name}</Text>
        <Text style={styles.destinationCategory}>{category}</Text>
        <View style={styles.ratingContainer}>{renderStars()}</View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    flex: 1,
  },

  // Header Styles
  headerContainer: {
    position: "relative",
    height: 220,
  },
  headerImage: {
    width: "100%",
    height: 220,
  },
  menuButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    position: "absolute",
    bottom: -25,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
  },

  // Featured Cards Styles
  featuredContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  featuredCard: {
    width: 280,
    height: 180,
    marginRight: 15,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  featuredCardImage: {
    borderRadius: 10,
  },
  featuredCardOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
    height: "100%",
    justifyContent: "center",
  },
  featuredCardTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  featuredCardButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  featuredCardButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },

  // Section Header Styles
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#762727",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#762727",
  },

  // Destination Cards Styles
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  destinationCard: {
    width: 250,
    height: 180,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  destinationInfo: {
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 10,
    marginTop: 120,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  destinationCategory: {
    fontSize: 12,
    color: "#fff",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 5,
  },

  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
})
