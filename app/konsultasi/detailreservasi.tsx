"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Linking,
  AppState,
} from "react-native"
import { ArrowLeft, AlertCircle } from "react-native-feather"
import { useRouter, useLocalSearchParams } from "expo-router"
import type { Doctor } from "../../utils/konsultasitypes"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_BASE_URL = "https://eace-2405-8740-6314-3409-592a-455a-e393-ad42.ngrok-free.app/api/v1"

interface PaymentRequest {
  doctor_id: string
  doctor_name: string // Field yang diperlukan backend
  schedule_id?: number
  consultation_date: string
  consultation_time: string
  amount: number
  admin_fee: number
  total_amount: number
  payment_method: string
  return_url?: string 
}

// Interface untuk payment response yang baru
interface PaymentResponse {
  message: string
  payments: {
    snap_url: string
    order_id: string
    status: string
  }
}

// API Service untuk membuat pembayaran
const createPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) {
      throw new Error("Token not found")
    }

    console.log("🔍 Creating payment")
    const url = `${API_BASE_URL}/payments/create-payment`

    console.log("📤 Payment request body:", paymentData)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    })

    console.log("📡 Payment response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ HTTP Error Detail:", {
        status: response.status,
        body: errorText,
      })
      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`)
    }

    const data: PaymentResponse = await response.json()
    console.log("🧾 Payment response:", data)

    return data
  } catch (error: any) {
    console.error("🚨 Error creating payment:", error.message || error)
    throw error
  }
}

export default function DetailReservasi() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentInProgress, setPaymentInProgress] = useState(false)

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active" && paymentInProgress) {
        console.log("🔄 App became active, user returned from payment")

        // Delay sedikit untuk memastikan user sudah kembali sepenuhnya
        setTimeout(() => {
          setPaymentInProgress(false)
          setIsProcessingPayment(false)

          // Tampilkan dialog konfirmasi pembayaran
          Alert.alert("Pembayaran Selesai", "Apakah pembayaran Anda berhasil?", [
            {
              text: "Belum Berhasil",
              style: "cancel",
              onPress: () => {
                console.log("❌ User indicated payment was not successful")
              },
            },
            {
              text: "Berhasil",
              onPress: () => {
                console.log("✅ User indicated payment was successful")
                // Navigate to ReservasiResult
                router.replace("/konsultasi/reservasiresult")
              },
            },
          ])
        }, 1000)
      }
    }

    const subscription = AppState.addEventListener("change", handleAppStateChange)
    return () => subscription?.remove()
  }, [paymentInProgress, router])

  // Handle deep linking dari Midtrans return URL
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log("🔗 Deep link received:", url)

      // Check if this is a return from Midtrans
      if (url.includes("payment-return") || url.includes("midtrans-return")) {
        console.log("💳 Detected return from Midtrans payment")

        setPaymentInProgress(false)
        setIsProcessingPayment(false)

        // Navigate to ReservasiResult
        router.replace("/konsultasi/reservasiresult")
      }
    }

    // Listen for deep links
    const linkingListener = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url)
    })

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })

    return () => {
      linkingListener?.remove()
    }
  }, [router])

  // Parse parameters
  const doctor: Doctor = params.doctor
    ? JSON.parse(params.doctor as string)
    : {
        id: "1",
        name: "dr. Selvi",
        specialty: "Gizi Klinik",
        price: "Rp100.000",
        rating: "98%",
        image: null,
      }

  const selectedDate = params.selectedDate ? Number.parseInt(params.selectedDate as string) : 14
  const selectedTime = (params.selectedTime as string) || "14.00"
  const complaint = (params.complaint as string) || ""
  const consultationData = params.consultationData ? JSON.parse(params.consultationData as string) : null

  // Calculate payment details
  const consultationFee = 100000 // Default fee, bisa diambil dari doctor.fee jika ada
  const adminFee = 2000
  const totalAmount = consultationFee + adminFee

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true)
      setPaymentInProgress(true)

      // Format date untuk API
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
      const day = selectedDate.toString().padStart(2, "0")
      const formattedDate = `${year}-${month}-${day}`

      // Prepare payment data dengan return URL
      const paymentData: PaymentRequest = {
        doctor_id: doctor.id,
        doctor_name: doctor.name,
        schedule_id: consultationData?.schedule_id || undefined,
        consultation_date: formattedDate,
        consultation_time: selectedTime,
        amount: totalAmount,
        admin_fee: adminFee,
        total_amount: totalAmount,
        payment_method: "virtual_account",
        return_url: "uc-mobile-boilerplate://konsultasi/reservasiresult", // Deep link untuk return dari Midtrans
      }

      console.log("💳 Processing payment with data:", paymentData)

      // Create payment
      const paymentResponse = await createPayment(paymentData)

      if (paymentResponse.message === "success" && paymentResponse.payments.snap_url) {
        console.log("✅ Payment created successfully")
        console.log("🔗 Snap URL:", paymentResponse.payments.snap_url)
        console.log("📋 Order ID:", paymentResponse.payments.order_id)
        console.log("📊 Status:", paymentResponse.payments.status)

        // Store payment info untuk referensi
        await AsyncStorage.setItem("lastPaymentOrderId", paymentResponse.payments.order_id)

        // Redirect to Midtrans payment page using snap_url
        const canOpen = await Linking.canOpenURL(paymentResponse.payments.snap_url)

        if (canOpen) {
          await Linking.openURL(paymentResponse.payments.snap_url)

          // Tidak perlu alert lagi karena akan handle via AppState atau deep link
          console.log("🌐 Opened Midtrans payment page")
        } else {
          throw new Error("Cannot open payment URL")
        }
      } else {
        throw new Error(paymentResponse.message || "Failed to create payment")
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error)

      setPaymentInProgress(false)
      setIsProcessingPayment(false)

      Alert.alert("Error Pembayaran", "Gagal memproses pembayaran. Silakan coba lagi.", [
        {
          text: "Coba Lagi",
          onPress: () => handlePayment(),
        },
        {
          text: "Kembali",
          style: "cancel",
        },
      ])
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-4">Detail Reservasi</Text>
        </View>
      </View>

      {/* Doctor Info */}
      <View className="bg-white m-4 p-4 rounded-lg">
        <View className="flex-row items-center">
          <Image
            source={
              doctor.image && typeof doctor.image === "string"
                ? { uri: doctor.image }
                : {
                    uri: "https://via.placeholder.com/64x64/22C55E/FFFFFF?text=👩‍⚕️",
                  }
            }
            className="w-16 h-16 rounded-lg"
          />
          <View className="ml-3">
            <Text className="font-medium">{doctor.name}</Text>
            <View className="bg-green-50 px-2 py-0.5 rounded-full mt-1">
              <Text className="text-green-500 text-xs">{doctor.specialty}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Consultation Details */}
      <View className="bg-white m-4 p-4 rounded-lg">
        <Text className="font-medium text-lg mb-2">Detail Konsultasi</Text>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <View className="bg-gray-100 p-2 rounded-lg mr-3">
              <Text className="text-gray-600">📅</Text>
            </View>
            <View>
              <Text className="font-medium">Selasa, {selectedDate} Mei 2025</Text>
              <Text className="text-gray-500">
                {selectedTime} - {selectedTime.split(".")[0]}:30 WIB
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-right">Metode Konsultasi</Text>
            <Text className="text-right font-medium">Online</Text>
          </View>
        </View>

        {complaint && (
          <View className="mt-4 pt-4 border-t border-gray-200">
            <Text className="font-medium mb-2">Keluhan</Text>
            <Text className="text-gray-600">{complaint}</Text>
          </View>
        )}
      </View>

      {/* Payment Details */}
      <View className="bg-white m-4 p-4 rounded-lg">
        <Text className="font-medium text-lg mb-2">Detail Pembayaran</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Biaya Konsultasi</Text>
          <Text className="font-medium">Rp{consultationFee.toLocaleString("id-ID")}</Text>
        </View>
        <View className="flex-row justify-between mb-4">
          <Text className="text-gray-600">Biaya Admin</Text>
          <Text className="font-medium">Rp{adminFee.toLocaleString("id-ID")}</Text>
        </View>
        <View className="border-t border-gray-200 pt-3">
          <View className="flex-row justify-between mb-2">
            <Text className="font-medium">Total Pembayaran</Text>
            <Text className="font-medium text-green-500">Rp{totalAmount.toLocaleString("id-ID")}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Metode Pembayaran</Text>
            <Text className="font-medium">Virtual Account</Text>
          </View>
        </View>
      </View>

      {/* Warning */}
      <View className="bg-white m-4 p-4 rounded-lg flex-row items-start">
        <AlertCircle stroke="#F59E0B" width={20} height={20} />
        <Text className="text-yellow-500 ml-2 flex-1">
          {paymentInProgress
            ? "Pembayaran sedang diproses. Setelah selesai, klik 'Return to merchant's page' untuk kembali ke aplikasi."
            : "Setelah pembayaran berhasil, tautan konsultasi online akan dikirimkan melalui email kamu."}
        </Text>
      </View>

      <View className="flex-1" />

      {/* Payment Button */}
      <View className="p-4 bg-white">
        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${isProcessingPayment ? "bg-gray-400" : "bg-green-500"}`}
          onPress={handlePayment}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">
                {paymentInProgress ? "Menunggu Pembayaran..." : "Memproses Pembayaran..."}
              </Text>
            </View>
          ) : (
            <Text className="text-white font-medium">Bayar Rp{totalAmount.toLocaleString("id-ID")}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
