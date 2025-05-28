"use client"

import { useState, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Custom hook untuk mengelola refresh data
export const useDataRefresh = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const saveRefreshFlag = useCallback(async () => {
    try {
      await AsyncStorage.setItem("needsRefresh", "true")
      await AsyncStorage.setItem("lastUpdateTime", Date.now().toString())
    } catch (error) {
      console.error("Error saving refresh flag:", error)
    }
  }, [])

  const checkRefreshFlag = useCallback(async () => {
    try {
      const needsRefresh = await AsyncStorage.getItem("needsRefresh")
      if (needsRefresh === "true") {
        await AsyncStorage.removeItem("needsRefresh")
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking refresh flag:", error)
      return false
    }
  }, [])

  return {
    refreshTrigger,
    triggerRefresh,
    saveRefreshFlag,
    checkRefreshFlag,
  }
}
