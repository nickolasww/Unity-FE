"use client"

import { StatusBar } from "expo-status-bar"
import { Text, TextInput, TouchableOpacity, View, SafeAreaView, Alert } from "react-native"
import { useState, useEffect } from "react"
import { router } from "expo-router"
import { loginUser } from "../../services/api"
import { validateEmail, validatePassword } from "../../utils/validation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FontAwesome } from "@expo/vector-icons"
import { AntDesign } from "@expo/vector-icons"
import { Ionicons } from "@expo/vector-icons"
import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"

// Register for redirect
WebBrowser.maybeCompleteAuthSession()

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleAuthInProgress, setIsGoogleAuthInProgress] = useState(false)

  // Define your app's URL scheme
  const redirectUri = Linking.createURL("/home")

  // Handle deep linking for OAuth callback
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("Token")
        if (token) {
          router.push("/home")
        }
      } catch (error) {
        console.error("Failed to check token", error)
      }
    }

    checkToken()
  }, [])

  const handleRedirect = async (event: { url: string | URL }) => {
    if (!isGoogleAuthInProgress || !event.url) return
  
    setIsGoogleAuthInProgress(false)
  
    try {
      const url = new URL(event.url)
      const error = url.searchParams.get("error")
  
      if (error) {
        Alert.alert("Login Gagal", decodeURIComponent(error))
        return
      }
    } catch (err: any) {
      Alert.alert("Autentikasi Error", err?.message || "Gagal memproses login.")
    }
  }
  
  const validateForm = (): boolean => {
    let isValid = true

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Mohon masukkan email yang valid.")
      isValid = false
    } else {
      setEmailError("")
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message || "Kata Sandi diperlukan.")
      isValid = false
    } else {
      setPasswordError("")
    }
    return isValid
  }

  // Handle login process
  const handleLogin = async () => {
    if (!validateForm()) return 

    try {
      setIsSubmitting(true)
      const data = await loginUser(email, password)

      if (data && data.token) {
        await AsyncStorage.setItem("Token", data.token)
        router.push("/home")
      } else {
        throw new Error("Authentication token tidak ditemukan")
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Email dan Password tidak valid.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleAuthInProgress(true)
  
      const authUrl = `https://462e-175-45-191-14.ngrok-free.app/api/v1/oauth/redirect`
  
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri, {
        showInRecents: true,
        preferEphemeralSession: true,
      })
  
      if (result.type === "cancel") {
        setIsGoogleAuthInProgress(false)
        Alert.alert("Dibatalkan", "Login Google dibatalkan.")
      }
  
      // Jika result.type === "success", handleRedirect akan berjalan otomatis via event listener
    } catch (error: any) {
      setIsGoogleAuthInProgress(false)
      Alert.alert("Google Sign In Error", error?.message || "Gagal login via Google")
    }
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 p-10">
        {/* Back button */}
        <TouchableOpacity className="mt-4" onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-10 pt-20">
          <Text className="text-[#FF6347] text-3xl font-bold">Masuk Akun</Text>
          <Text className="text-[#FF6347] mt-2">
            Selamat datang kembali, silahkan masukkan email dan kata sandi kamu.
          </Text>
        </View>

        <View className="mt-8">
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
                if (passwordError) setPasswordError("") // Reset password error on change
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

        <TouchableOpacity
          className="bg-[#FFA69E] rounded-lg py-4 items-center mt-8"
          onPress={handleLogin}
          disabled={isSubmitting}
        >
          <Text className="text-white font-bold">{isSubmitting ? "Masuk..." : "Masuk"}</Text>
        </TouchableOpacity>

        <View className="flex-row items-center justify-center my-6">
          <View className="border-t border-gray-300 flex-1"></View>
          <Text className="mx-4 text-gray-500">Atau</Text>
          <View className="border-t border-gray-300 flex-1"></View>
        </View>

        <TouchableOpacity
          className="bg-white rounded-lg py-4 border border-gray-300 flex-row items-center justify-center"
          onPress={handleGoogleSignIn}
          disabled={isGoogleAuthInProgress}
        >
          <View className="mr-2">
            <FontAwesome name="google" size={18} color="#4285F4" />
          </View>
          <Text className="text-gray-700">{isGoogleAuthInProgress ? "Menghubungkan..." : "Masuk dengan Google"}</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-700">Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="font-bold text-[#FF6347]">Daftar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" />
    </View>
  )
}

export default Login
