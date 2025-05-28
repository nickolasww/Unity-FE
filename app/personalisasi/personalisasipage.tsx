"use client"

import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrowLeft, Calendar, Check } from "react-native-feather"
import DateTimePicker from "@react-native-community/datetimepicker"
import "nativewind"
import { useRouter } from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API configuration
const API_BASE_URL = "https://nutripath.bccdev.id/api/v1"

export default function PersonalisasiPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessPage, setShowSuccessPage] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const router = useRouter()

  // Form data state
  const [formData, setFormData] = useState({
    tanggalLahir: "",
    jenisKelamin: "",
    beratBadan: "",
    tinggiBadan: "",
    aktivitasHarian: "",
    kondisiKesehatan: [],
    kondisiKesehatanLainnya: "",
    tujuanKesehatan: "",
  })

  const HandleToGoNuTracker = () => {
    router.push("/(tabs)/NuTracker")
  }

  const handleLewati = () => {
    router.push("/(tabs)/beranda")
  }

  const handleNantiSaja = () => {
    router.push("/(tabs)/beranda")
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

  // Send data to backend
  const sendDataToBackend = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken")
      const dataToSend = {
        birth_date: formData.tanggalLahir
          ? convertDateToBackendFormat(formData.tanggalLahir)
          : new Date().toISOString(),
        gender: formData.jenisKelamin,
        weight: Number.parseFloat(formData.beratBadan),
        height: Number.parseFloat(formData.tinggiBadan),
        sickness: formatHealthConditions(),
        activity: mapActivityLevel(formData.aktivitasHarian),
        goal: mapHealthGoal(formData.tujuanKesehatan),
      }

      console.log("Sending data to backend:", dataToSend)

      const response = await fetch(`${API_BASE_URL}/users/create-personalization`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return { success: true }
    } catch (error) {
      console.error("Error sending data to backend:", error)
      Alert.alert("Error", "Gagal terhubung ke server. Silakan coba lagi.", [
        {
          text: "Coba Lagi",
          onPress: () => sendDataToBackend(),
        },
        {
          text: "Batal",
          style: "cancel",
        },
      ])
      throw error
    }
  }

  const convertDateToBackendFormat = (dateString: string) => {
    try {
      const parts = dateString.split("/")
      const date = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]) - 1, Number.parseInt(parts[0]))
      return date.toISOString()
    } catch (error) {
      return new Date().toISOString()
    }
  }

  const getUserToken = () => {
    return "your-jwt-token-here"
  }

  const formatHealthConditions = () => {
    if (formData.kondisiKesehatan.includes("Tidak ada")) {
      return "none"
    }

    const conditionMap = {
      Diabetes: "diabetes",
      Hipertensi: "hypertension",
      "Kolesterol tinggi": "high_cholesterol",
      "Gangguan ginjal": "kidney_disease",
    }

    const mappedConditions = formData.kondisiKesehatan
      .map((condition) => conditionMap[condition] || condition.toLowerCase())
      .filter((condition) => condition !== "tidak ada")

    if (formData.kondisiKesehatanLainnya) {
      mappedConditions.push(formData.kondisiKesehatanLainnya.toLowerCase())
    }

    return mappedConditions.length > 0 ? mappedConditions.join(",") : "none"
  }

  const mapActivityLevel = (activity: string) => {
    const activityMap = {
      "Kurang Gerak": "Sedentary",
      "Aktif Ringan": "Light",
      "Cukup Aktif": "Moderate",
      "Sangat Aktif": "Active",
      "Super Aktif": "Very Active",
    }
    return activityMap[activity] || "Moderate"
  }

  const mapHealthGoal = (goal: string) => {
    const goalMap = {
      "Menurunkan berat badan": "Lose",
      "Menjaga berat badan": "Maintain",
      "Menambah massa otot": "Gain",
      "Menambah berat badan": "Gain",
    }
    return goalMap[goal] || "Maintain"
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Validate required fields
      if (
        !formData.tanggalLahir ||
        !formData.jenisKelamin ||
        !formData.beratBadan ||
        !formData.tinggiBadan ||
        !formData.aktivitasHarian ||
        !formData.tujuanKesehatan
      ) {
        Alert.alert("Error", "Mohon lengkapi semua data yang diperlukan")
        setIsLoading(false)
        return
      }

      // Send data to backend
      await sendDataToBackend()

      // Show success page
      setShowSuccessPage(true)
    } catch (error) {
      // Error handling is done in sendDataToBackend function
    } finally {
      setIsLoading(false)
    }
  }

  // Handle next step
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date()

    if (Platform.OS === "android") {
      setShowDatePicker(false)
    }

    const day = currentDate.getDate().toString().padStart(2, "0")
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const year = currentDate.getFullYear()

    const formattedDate = `${day}/${month}/${year}`

    setFormData({
      ...formData,
      tanggalLahir: formattedDate,
    })
  }

  // Handle checkbox selection
  const handleCheckboxChange = (value) => {
    if (value === "Tidak ada") {
      setFormData({
        ...formData,
        kondisiKesehatan: ["Tidak ada"],
      })
      return
    }

    let newKondisiKesehatan = [...formData.kondisiKesehatan]

    if (newKondisiKesehatan.includes("Tidak ada")) {
      newKondisiKesehatan = newKondisiKesehatan.filter((item) => item !== "Tidak ada")
    }

    if (newKondisiKesehatan.includes(value)) {
      newKondisiKesehatan = newKondisiKesehatan.filter((item) => item !== value)
    } else {
      newKondisiKesehatan.push(value)
    }

    setFormData({
      ...formData,
      kondisiKesehatan: newKondisiKesehatan,
    })
  }

  // Handle radio selection
  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  // Render progress steps
  const renderProgressSteps = () => {
    return (
      <View className="flex-row items-center justify-center mt-4 mb-8 px-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <View
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step < currentStep || step === currentStep ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              {step < currentStep ? (
                <Check width={16} height={16} color="white" />
              ) : (
                <Text className={`text-sm font-bold ${step === currentStep ? "text-white" : "text-gray-500"}`}>
                  {step}
                </Text>
              )}
            </View>

            {step < 4 && <View className={`h-0.5 w-8 ${step < currentStep ? "bg-orange-500" : "bg-gray-200"}`} />}
          </React.Fragment>
        ))}
      </View>
    )
  }

  // Render checkbox
  const renderCheckbox = (value, label) => {
    const isChecked = formData.kondisiKesehatan.includes(value)

    return (
      <TouchableOpacity
        className={`flex-row items-center border-b border-gray-200 p-4 ${isChecked ? "bg-orange-50" : ""}`}
        onPress={() => handleCheckboxChange(value)}
      >
        <View
          className={`w-5 h-5 rounded border ${isChecked ? "bg-orange-500 border-orange-500" : "border-gray-300"} mr-3`}
        >
          {isChecked && <Check width={16} height={16} color="white" />}
        </View>
        <Text className="text-base">{label}</Text>
      </TouchableOpacity>
    )
  }

  // Render radio button
  const renderRadioButton = (field, value, label, description = "", emoji = "") => {
    const isSelected = formData[field] === value

    return (
      <TouchableOpacity
        className={`flex-row items-center border-b border-gray-200 p-4 ${isSelected ? "bg-orange-50" : ""}`}
        onPress={() => handleRadioChange(field, value)}
      >
        <View className="flex-row items-center">
          <View className={`w-5 h-5 rounded-full border ${isSelected ? "border-orange-500" : "border-gray-300"} mr-3`}>
            {isSelected && <View className="w-3 h-3 rounded-full bg-orange-500 absolute top-1 left-1" />}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className={`text-base ${isSelected ? "text-orange-500 font-medium" : ""}`}>{label}</Text>
              {emoji ? <Text className="ml-1">{emoji}</Text> : null}
            </View>
            {description ? <Text className="text-gray-500 text-sm">{description}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Render step 1 - Personal Information
  const renderStep1 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Tanggal Lahir</Text>
        <View className="flex-row items-center border rounded-lg mb-6 px-4 py-3">
          <TextInput
            className="flex-1 text-base"
            placeholder="Masukkan tanggal lahirmu"
            value={formData.tanggalLahir}
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Calendar width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Date Picker for iOS */}
        {Platform.OS === "ios" && showDatePicker && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white p-4">
                <View className="flex-row justify-between mb-4">
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-orange-500 text-base">Batal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text className="text-orange-500 text-base">Selesai</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={
                    formData.tanggalLahir ? new Date(formData.tanggalLahir.split("/").reverse().join("-")) : new Date()
                  }
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              </View>
            </View>
          </Modal>
        )}

        {/* Date Picker for Android */}
        {Platform.OS === "android" && showDatePicker && (
          <DateTimePicker
            value={formData.tanggalLahir ? new Date(formData.tanggalLahir.split("/").reverse().join("-")) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <Text className="text-xl font-bold mb-4">Jenis Kelamin</Text>
        <View className="border rounded-lg mb-6 overflow-hidden">
          {renderRadioButton("jenisKelamin", "Perempuan", "Perempuan")}
          {renderRadioButton("jenisKelamin", "Laki-laki", "Laki-laki")}
        </View>

        <Text className="text-xl font-bold mb-4">Berat Badan (Kg)</Text>
        <TextInput
          className="border rounded-lg mb-6 px-4 py-3 text-base"
          placeholder="Misal: 50"
          keyboardType="numeric"
          value={formData.beratBadan}
          onChangeText={(text) => setFormData({ ...formData, beratBadan: text })}
        />

        <Text className="text-xl font-bold mb-4">Tinggi Badan (cm)</Text>
        <TextInput
          className="border rounded-lg mb-6 px-4 py-3 text-base"
          placeholder="Misal: 160"
          keyboardType="numeric"
          value={formData.tinggiBadan}
          onChangeText={(text) => setFormData({ ...formData, tinggiBadan: text })}
        />
      </View>
    )
  }

  // Render step 2 - Daily Activity
  const renderStep2 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Aktivitas Harian</Text>
        <View className="border rounded-lg overflow-hidden">
          {renderRadioButton(
            "aktivitasHarian",
            "Kurang Gerak",
            "Kurang Gerak",
            "(tidak berolahraga, kerja di balik meja)",
            "🧍",
          )}
          {renderRadioButton(
            "aktivitasHarian",
            "Aktif Ringan",
            "Aktif Ringan",
            "(berjalan santai, pekerjaan rumah ringan)",
            "🚶",
          )}
          {renderRadioButton(
            "aktivitasHarian",
            "Cukup Aktif",
            "Cukup Aktif",
            "(banyak gerak tapi tidak terlalu berat)",
            "🚶‍♀️",
          )}
          {renderRadioButton(
            "aktivitasHarian",
            "Sangat Aktif",
            "Sangat Aktif",
            "(rutin olahraga atau kerja fisik)",
            "🏃",
          )}
          {renderRadioButton(
            "aktivitasHarian",
            "Super Aktif",
            "Super Aktif",
            "(aktivitas fisik sangat intens setiap hari)",
            "🏋️",
          )}
        </View>
      </View>
    )
  }

  // Render step 3 - Health Conditions
  const renderStep3 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Kondisi Kesehatan Khusus</Text>
        <View className="border rounded-lg overflow-hidden">
          {renderCheckbox("Tidak ada", "Tidak ada")}
          {renderCheckbox("Diabetes", "Diabetes")}
          {renderCheckbox("Hipertensi", "Hipertensi")}
          {renderCheckbox("Kolesterol tinggi", "Kolesterol tinggi")}
          {renderCheckbox("Gangguan ginjal", "Gangguan ginjal")}
          <View className="flex-row items-center border-b border-gray-200 p-4">
            <View className="w-5 h-5 rounded border border-gray-300 mr-3" />
            <TextInput
              className="flex-1 text-base"
              placeholder="Lainnya: _______"
              value={formData.kondisiKesehatanLainnya}
              onChangeText={(text) => setFormData({ ...formData, kondisiKesehatanLainnya: text })}
            />
          </View>
        </View>
      </View>
    )
  }

  // Render step 4 - Health Goals
  const renderStep4 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Tujuan Kesehatan</Text>
        <View className="border rounded-lg overflow-hidden">
          {renderRadioButton("tujuanKesehatan", "Menurunkan berat badan", "Menurunkan berat badan")}
          {renderRadioButton("tujuanKesehatan", "Menjaga berat badan", "Menjaga berat badan")}
          {renderRadioButton("tujuanKesehatan", "Menambah massa otot", "Menambah massa otot")}
          {renderRadioButton("tujuanKesehatan", "Menambah berat badan", "Menambah berat badan")}
        </View>
      </View>
    )
  }

  // Render loading modal
  const renderLoadingModal = () => {
    return (
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-white rounded-lg p-8 items-center mx-8">
            <ActivityIndicator size="large" color="#F97316" className="mb-4" />
            <Text className="text-base text-center">Tunggu sebentar yaa</Text>
          </View>
        </View>
      </Modal>
    )
  }

  // Render success page
  const renderSuccessPage = () => {
    return (
      <View className="flex-1 px-6 py-8 bg-white">
        {/* Illustration */}
        <View className="flex items-center justify-center mt-20">
          <Image source={require("../../assets/PersonalisasiImg.png")}  className="w-80 h-80" />
        </View>

        {/* Content */}
        <View className="items-center mb-20">
          <Text className="text-2xl font-bold text-orange-500 mb-4 text-center">NuTracker telah disiapkan!</Text>

          <Text className="text-base text-gray-700 text-center leading-6">
            Kami telah menetapkan <Text className="font-semibold">target kalori harian</Text> berdasarkan informasi yang
            kamu berikan.{"\n"}
            Jelajahi NuTracker untuk melihat rincian lengkapnya.
          </Text>
        </View>

        {/* Buttons */}
        <View className="space-y-4 flex-row items-center justify-center gap-6 mt-32 ">
          <TouchableOpacity className="border border-orange-500 rounded-lg py-4 px-8 items-center" onPress={handleNantiSaja}>
            <Text className="text-orange-500 font-medium text-base">Nanti Saja</Text>
          </TouchableOpacity>

           <TouchableOpacity className="bg-orange-500 rounded-lg py-4 items-center px-12" onPress={HandleToGoNuTracker}>
            <Text className="text-white font-bold text-base">Lihat NuTracker</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Render current step content
  const renderStepContent = () => {
    if (showSuccessPage) {
      return renderSuccessPage()
    }

    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return null
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white py-2">
      {!showSuccessPage && (
        <>
          {/* Header */}
          <View className="flex-row items-center justify-end p-4">
            <TouchableOpacity onPress={handleLewati}>
              <Text className="text-gray-500">Lewati</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Steps */}
          {renderProgressSteps()}

          {/* Content */}
          <ScrollView className="flex-1">{renderStepContent()}</ScrollView>

          {/* Footer Button */}
          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity className="bg-orange-500 rounded-lg py-4 items-center" onPress={handleNext}>
              <Text className="text-white font-bold text-base">{currentStep === 4 ? "Kirim" : "Lanjut"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {showSuccessPage && renderStepContent()}

      {/* Loading Modal */}
      {renderLoadingModal()}
    </SafeAreaView>
  )
}
