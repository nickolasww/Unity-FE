"use client"; 

import { useRef } from "react";
import {useState, useEffect } from "react";
import { Animated, Easing} from "react-native";

export const useSpinAnimation = (isActive: boolean) => { 
    const [spinAnimation] = useState (new Animated.Value(0));
    const spinLoopRef = useRef<Animated.CompositeAnimation | null>(null);

 useEffect(() => {
    if (isActive) {
      const spinLoop = Animated.loop(
        Animated.timing(spinAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      )
      spinLoop.start()
      spinLoopRef.current = spinLoop

      return () => {
        spinLoop.stop()
      }
    } else {
      spinAnimation.setValue(0)
    }
  }, [isActive, spinAnimation])

  return { spinAnimation }
}
