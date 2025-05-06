"use client"

import React from "react"
import { View, Text, StyleSheet, ActivityIndicator, Modal, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated"

interface LoadingOverlayProps {
  visible: boolean
  message?: string
  type?: "spinner" | "custom"
}

const { width, height } = Dimensions.get("window")

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = "Generating your plan...",
  type = "custom",
}) => {
  // Rotation animation for custom spinner
  const rotation = useSharedValue(0)

  React.useEffect(() => {
    if (visible && type === "custom") {
      rotation.value = 0
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 1500,
          easing: Easing.linear,
        }),
        -1, // Infinite repetitions
        false, // Don't reverse the animation
      )
    }
  }, [visible, type, rotation])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    }
  })

  if (!visible) return null

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loadingContainer}>
          {type === "spinner" ? (
            <ActivityIndicator size="large" color="#8B2323" />
          ) : (
            <View style={styles.customSpinnerContainer}>
              <Animated.View style={[styles.customSpinner, animatedStyle]}>
                <View style={styles.spinnerGradient} />
              </Animated.View>
            </View>
          )}
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  customSpinnerContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  customSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderTopColor: "#8B2323",
    borderRightColor: "rgba(139, 35, 35, 0.6)",
    borderBottomColor: "rgba(139, 35, 35, 0.3)",
    borderLeftColor: "rgba(139, 35, 35, 0.1)",
  },
  spinnerGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
})

export default LoadingOverlay
