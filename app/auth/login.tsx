"use client"

import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FontAwesome } from "@expo/vector-icons"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsSubmitting(true)
    try {
      if (email === "Test@example.com" && password === "Wewe31") {
        await AsyncStorage.setItem("authToken", "dummyToken") 
        router.push("/personalisasi/personalisasipage")
      } else {
        Alert.alert("Login Failed", "Invalid credentials")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-8">
      <Text className="text-2xl font-bold mb-6">Login</Text>

      <TextInput
        className="w-full bg-white rounded-lg py-4 px-6 mb-4 border border-gray-300"
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-full bg-white rounded-lg py-4 px-6 mb-6 border border-gray-300"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="w-full bg-blue-500 rounded-lg py-4 items-center justify-center"
        onPress={handleLogin}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white rounded-lg py-4 border border-gray-300 flex-row items-center justify-center mt-4"
      >
        <View className="mr-2">
          <FontAwesome name="google" size={18} color="#4285F4" />
        </View>
        <Text className="text-gray-700">Masuk dengan Google</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Login