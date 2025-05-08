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
  const redirectUri = Linking.createURL("auth/callback")

  // Handle deep linking for OAuth callback
  useEffect(() => {
    // Set up the URL listener for when the app is opened via deep link
    const subscription = Linking.addEventListener("url", handleRedirect)

    return () => {
      subscription.remove()
    }
  }, [])

  // Handle the redirect from OAuth
  const handleRedirect = async (event: { url: string | URL }) => {
    if (isGoogleAuthInProgress && event.url) {
      setIsGoogleAuthInProgress(false)

      try {
        // Extract token or auth code from URL if your backend redirects with these params
        const url = new URL(event.url)
        const token = url.searchParams.get("token")
        const error = url.searchParams.get("error")

        if (error) {
          Alert.alert("Authentication Error", error)
          return
        }

        if (token) {
          // Store the token
          await AsyncStorage.setItem("authToken", token)
          router.push("/home")
        } else {
          // If no token in URL, you might need to exchange a code for a token
          const code = url.searchParams.get("code")
          if (code) {
            // Exchange code for token with your backend
            try {
              const response = await fetch("https://ef84-175-45-191-14.ngrok-free.app/api/v1/oauth/token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ code }),
              })

              const data = await response.json()
              if (data && data.token) {
                await AsyncStorage.setItem("authToken", data.token)
                router.push("/home")
              } else {
                throw new Error("No token received from server")
              }
            } catch (error) {
              Alert.alert("Authentication Error", "Failed to exchange code for token")
            }
          } else {
            Alert.alert("Authentication Error", "No token or code found in redirect URL")
          }
        }
      } catch (error) {
        Alert.alert("Authentication Error", error.message || "Failed to process authentication")
      }
    }
  }

  // Validate the form
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
    if (!validateForm()) return // Prevent login if form is invalid

    try {
      setIsSubmitting(true)
      const data = await loginUser(email, password)

      // Check if token exists before storing it
      if (data && data.token) {
        await AsyncStorage.setItem("authToken", data.token)
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

      // Include the redirect URI as a query parameter
      // This tells your backend where to redirect after authentication
      const authUrl = `https://ef84-175-45-191-14.ngrok-free.app/api/v1/oauth/redirect?redirect_uri=${encodeURIComponent(redirectUri)}`

      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri, {
        showInRecents: true,
        // This ensures the browser closes after redirect
        preferEphemeralSession: true,
      })

      // If user manually cancels the auth session
      if (result.type === "cancel") {
        setIsGoogleAuthInProgress(false)
        Alert.alert("Authentication Canceled", "Google sign in was canceled")
      }

      // The actual token handling will be done in the handleRedirect function
      // when the app is opened via deep link
    } catch (error) {
      setIsGoogleAuthInProgress(false)
      Alert.alert("Google Sign In Error", error.message || "Failed to authenticate with Google")
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
