import { useState, useRef, useEffect } from "react"
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
  Image,
  Animated,
} from "react-native"
import { Link, router } from "expo-router"
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
      image: require("../assets/BeachLanding.png"), 
      subtitle: "Ketahui nutrisi makanan dengan NutriKu dan dapatkan rekomendasi resep sesuai bahan yang kamu miliki dengan ResepKu",
      showBackButton: false,
    },
    {
      id: "2",
      title: "Jalan Mudah Menuju Gizi Seimbang",
      image: require("../assets/GunungLanding.png"), 
      subtitle: "Nutracker yang memahami kebutuhan tubuhmu. Catat apa yang kamu makan, pantau asupan nutrisimu",
      showBackButton: true,
    },
    {
      id: "3",
      image: require("../assets/MomLanding.png"),
      title: "Konsultasi Personal untuk Hasil Maksimal",
      subtitle: "Dapatkan nasihat dari ahli untuk mengoptimalkan pola makanmu dan mencapai tujuan kesehatanmu.", 
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

  // Splash Screen Component
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image 
            source={require('../assets/nutripath-logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground
          source={item.image}
          style={styles.backgroundImage}
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
                <Text style={styles.skipText}>Lewati</Text>
                <Ionicons name="arrow-forward" size={16} color="#FF5733" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
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

              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueButtonText}>
                  {index === slides.length - 1 ? "Mulai" : "Lanjut"}
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
  // Splash screen styles
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F2', // Light background color
    // Gradient effect can be achieved with a LinearGradient component from expo-linear-gradient
    // or with an ImageBackground with a gradient image
  },
  logo: {
    width: 200,
    height: 100,
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
    flexDirection: "row",
    alignItems: "center",
  },
  skipText: {
    color: "#FF5733",
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
    paddingHorizontal: 20,
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
    marginBottom: 30,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#FF5733",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  continueButton: {
    backgroundColor: "#FF5733",
    paddingVertical: 15,
    borderRadius: 8,
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