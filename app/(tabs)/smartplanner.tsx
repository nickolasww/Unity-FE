import { useState, useRef } from "react";
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
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SmartPlanner() {
  const flatListRef = useRef(null);

  const slides = [
    {
      id: "1",
      title: "Welcome to Glamify!",
      image: require("../../assets/SmarPlannerImage.png"),
      subtitle:
        "Your go-to platform for sustainable fashion!\nDiscover an easy way to switch to an eco-friendly lifestyle while staying stylish.",
      showBackButton: false,
    },
  ];

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <ImageBackground source={item.image} className="flex-1 bg-cover">
          <SafeAreaView style={styles.safeArea}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.contentContainer}>
              <View style={styles.textContainer}>
                <Text className="text-white font-bold text-4xl text-center mb-10">
                  Smart Planner
                </Text>
                <Text className="text-center text-white text-md px-7">
                  Connect with tailors & repair services for your old clothes.
                  Discover sustainable fashion stores & events in your city
                </Text>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={() => router.push("/smartinput")}>
                <Text style={styles.continueButtonText}>Create New Plan</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  };

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
        keyExtractor={(item) => item.id}
        initialScrollIndex={0}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
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
  skipText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 150,
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
  continueButton: {
    backgroundColor: "#762727",
    paddingVertical: 15,
    borderRadius: 40,
    alignItems: "center",
    marginHorizontal: 90,
  },
  continueButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    padding: 20,
  },
});
