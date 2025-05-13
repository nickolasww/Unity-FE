"use client"; 

import { useEffect, useState } from "react";
import { Animated } from "react-native"; 

export const useModalAnimation = (isVisible: boolean) => { 
    const [modalAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible, modalAnimation])

  return { modalAnimation }
}