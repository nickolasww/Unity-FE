"use client"

import { useState } from "react"
import { Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native"
import { router } from "expo-router"
import { registerUser } from "../../services/api"
import { validateEmail, validatePassword } from "../../utils/validation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons"

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = (): boolean => {
    let isValid = true

    // Validate name
    if (!name) {
      Alert.alert("Please enter your name.")
      isValid = false
    }

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.")
      isValid = false
    } else {
      setEmailError("")
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message || "Password is required.")
      isValid = false
    } else {
      setPasswordError("")
    }

    // Validate confirmPassword
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.")
      isValid = false
    } else {
      setConfirmPasswordError("")
    }

    return isValid
  }

  // Handle registration process
  const handleRegister = async () => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      const data = await registerUser(name, email, password, confirmPassword)

      // Check if token exists before storing it
      if (data && data.token) {
        await AsyncStorage.setItem("authToken", data.token)
        router.push("/home")
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message || "Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 p-10">
        {/* Back button */}
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-10 pt-10">
          <Text className="text-[#FF6347] text-3xl font-bold">Daftar Akun</Text>
          <Text className="text-[#FF6347] mt-2">Mohon isikan data diri kamu dengan benar</Text>
        </View>

        <View className="mt-8">
          <Text className="text-gray-800 mb-2">Nama</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik nama di sini"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="user" size={18} color="#999" />
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Email</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik email di sini"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError) setEmailError("")
              }}
            />
            <View className="absolute left-3 top-4">
              <FontAwesome name="envelope-o" size={18} color="#999" />
            </View>
          </View>
          {emailError ? <Text className="text-red-500 text-xs mt-1">{emailError}</Text> : null}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                if (passwordError) setPasswordError("")
              }}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="absolute right-3 top-4">
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text className="text-red-500 text-xs mt-1">{passwordError}</Text> : null}
        </View>

        <View className="mt-4">
          <Text className="text-gray-800 mb-2">Konfirmasi Kata Sandi</Text>
          <View className="relative">
            <TextInput
              className="h-14 border border-gray-300 rounded-lg px-4 pl-10 text-gray-700 bg-white"
              placeholder="Ketik kata sandi di sini"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text)
                if (confirmPasswordError) setConfirmPasswordError("")
              }}
            />
            <View className="absolute left-3 top-4">
              <AntDesign name="lock" size={18} color="#999" />
            </View>
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-4"
            >
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text className="text-red-500 text-xs mt-1">{confirmPasswordError}</Text> : null}
        </View>

        <TouchableOpacity
          className="bg-[#FFA69E] rounded-lg py-4 items-center mt-8"
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold">{isSubmitting ? "Mendaftar..." : "Daftar"}</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center my-6">
          <View className="border-t border-gray-300 flex-1"></View>
          <Text className="mx-4 text-gray-500">Atau</Text>
          <View className="border-t border-gray-300 flex-1"></View>
        </View>

        <TouchableOpacity className="bg-white rounded-lg py-4 border border-gray-300 flex-row items-center justify-center">
          <View className="mr-2">
            <FontAwesome name="google" size={18} color="#4285F4" />
          </View>
          <Text className="text-gray-700">Daftar dengan Google</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-700">Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="font-bold text-[#FF6347]">Masuk</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
    </View>
  )
}

export default Register
