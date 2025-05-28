"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  Image,
  Animated,
} from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const flatListRef = useRef(null)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Logo fade-in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const slides = [
    {
      id: "1",
      title: "Temukan Rahasia Nutrisi dalam Sekali Scan",
      image: require("../assets/Splash1.png"),
      subtitle:
        "Ketahui nutrisi makanan dengan NutriKu dan dapatkan rekomendasi resep sesuai bahan yang kamu miliki dengan ResepKu",
      showBackButton: false,
    },
    {
      id: "2",
      title: "Jalan Mudah Menuju Gizi Seimbang",
      image: require("../assets/Splash2.png"),
      subtitle: "Nutracker yang memahami kebutuhan tubuhmu. Catat apa yang kamu makan, pantau asupan nutrisimu",
      showBackButton: true,
    },
    {
      id: "3",
      title: "Konsultasi Personal untuk Hasil Maksimal",
      image: require("../assets/splash3.png"),
      subtitle: "Dapatkan nasihat dari ahli untuk mengoptimalkan pola makanmu dan mencapai tujuan kesehatanmu.",
      showBackButton: true,
    },
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

  // Splash Screen Component
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image source={require("../assets/nutripath-logo.png")} style={styles.logo} resizeMode="contain" />
        </Animated.View>
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <StatusBar barStyle="dark-content" />
        <ImageBackground source={item.image} style={styles.backgroundImage}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>Lewati</Text>
              <Ionicons name="arrow-forward" size={16} color="#FF5733" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        <View style={styles.bottomContainer}>
          <View style={styles.paginationContainer}>
            {slides.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.paginationDot,
                  index === dotIndex ? styles.paginationDotActive : styles.paginationDotInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
            <Text style={styles.continueButtonText}>{index === slides.length - 1 ? "Mulai" : "Lanjut"}</Text>
          </TouchableOpacity>

          <View style={styles.bottomIndicator} />
        </View>
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
  // Splash screen styles
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF5F2", 
  },
  logo: {
    width: 200,
    height: 100,
  },
  slide: {
    width,
    height,
    backgroundColor: "white",
  },
  backgroundImage: {
    height: height * 0.6, 
    width: width,
    resizeMode: "cover",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  skipButton: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  skipText: {
    color: "#FF5733",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomContainer: {
    height: height * 0.4, // Bottom container takes 40% of screen height
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  textContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    color: "#333",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#FF5733",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotInactive: {
    backgroundColor: "#DDD",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#333",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 20,
  },
})