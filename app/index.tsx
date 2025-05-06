import { useState, useRef } from "react"
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
} from "react-native"
import { Link, router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import "../global.css"

const { width, height } = Dimensions.get("window")

export default function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const flatListRef = useRef(null)
  
  const slides = [
    {
      id: "1",
      title: "Welcome to Nusatrip",
      image: require("../assets/BeachLanding.png"), 
      subtitle: "Your go-to platform for sustainable fashion! Discover an easy way to switch to an eco-friendly lifestyle while staying stylish.",
      showBackButton: false,
    },
    {
      id: "2",
      title: "Indonesia Culture",
      image: require("../assets/GunungLanding.png"), 
      subtitle: "Culture Sync lets travelers find and book local cultural events nearby, offering real-time updates and easy access to authentic experiences.",
      showBackButton: true,
    },
    {
      id: "3",
      image: require("../assets/MomLanding.png"),
      title: "Smart Planner",
      subtitle: "Smart Trip-AI Planner creates a personalized itinerary using your preferences and real-time data, making travel planning effortless.", 
      showBackButton: true,
    }
  ]

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      })
    } else {
      router.push("/auth/login")
    }
  }

  const handleBack = () => {
    if (currentPage > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentPage - 1,
        animated: true,
      })
    }
  }

  const handleSkip = () => {
    router.push("/auth/login")
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground
          source={item.image}
          className="flex-1 bg-cover"
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              {item.showBackButton ? (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <View style={styles.headerLeft} />
              )}
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text className="text-white font-bold text-4xl text-center mb-10">{item.title}</Text>
                <Text className="text-center text-white text-sm">{item.subtitle}</Text>
              </View>

              <View style={styles.paginationContainer}>
                {slides.map((_, dotIndex) => (
                  <View
                    key={dotIndex}
                    style={[
                      styles.paginationDot,
                      index === dotIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueButtonText}>
                  {index === slides.length - 1 ? "Get Started" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    )
  }

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / width)
    setCurrentPage(currentIndex)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerLeft: {
    width: 40,
  },
  backButton: {
    padding: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  textContainer: {
    marginBottom: 40,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.9,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#E74C3C",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: "#E74C3C",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})