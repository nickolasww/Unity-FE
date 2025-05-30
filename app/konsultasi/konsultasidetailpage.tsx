"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { ThumbsUp, ArrowLeft } from "react-native-feather"
import { useRouter, useLocalSearchParams } from "expo-router"
import type { Doctor } from "../../utils/konsultasitypes"
import VerificationModal from "../../components/modal/verificationModal"
import AsyncStorage from "@react-native-async-storage/async-storage"

const API_BASE_URL = "https://eace-2405-8740-6314-3409-592a-455a-e393-ad42.ngrok-free.app/api/v1"

// Interface untuk response backend yang sebenarnya
interface BackendSchedule {
  id: number
  doctor_id: number
  start_time: string
  end_time: string
  is_available: boolean
}

interface BackendDoctorResponse {
  doctors: {
    id: number
    name: string
    specialization: string
    workplace: string
    year_experience: number
    fee: number
    likes: number
    image: string
    schedules: BackendSchedule[]
  }
  message: string
}

interface DoctorDetail extends Doctor {
  hospital?: string
  experience?: string
  description?: string
  fee?: number
  likes?: number
  workplace?: string
  year_experience?: number
  schedules?: BackendSchedule[]
}

// Interface untuk schedule yang sudah diproses
interface ProcessedSchedule {
  dates: Array<{
    day: string
    date: number
    available: boolean
  }>
  times: Array<{
    time: string
    scheduleId: number
    available: boolean
  }>
}

const fetchDoctorDetail = async (doctorId: string): Promise<DoctorDetail> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    const url = `${API_BASE_URL}/doctors/get/${doctorId}`

    console.log("🔍 Fetching doctor detail:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("📡 Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ HTTP Error Detail:", {
        status: response.status,
        body: errorText,
      })
      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`)
    }

    const data: BackendDoctorResponse = await response.json()
    console.log("🧾 Doctor detail response:", data)

    // Transform backend data ke format yang dibutuhkan UI
    const backendDoctor = data.doctors
    const transformedDoctor: DoctorDetail = {
      id: backendDoctor.id.toString(),
      name: backendDoctor.name,
      specialty: backendDoctor.specialization,
      price: `Rp${backendDoctor.fee.toLocaleString("id-ID")}`,
      rating: `${backendDoctor.likes}`,
      image: backendDoctor.image,
      hospital: backendDoctor.workplace,
      experience: `${backendDoctor.year_experience} Tahun Pengalaman`,
      fee: backendDoctor.fee,
      likes: backendDoctor.likes,
      workplace: backendDoctor.workplace,
      year_experience: backendDoctor.year_experience,
      schedules: backendDoctor.schedules,
    }

    return transformedDoctor
  } catch (error: any) {
    console.error("🚨 Error fetching doctor detail:", error.message || error)
    throw error
  }
}

// Fungsi untuk generate tanggal dan hari
const generateDatesForCurrentWeek = () => {
  const today = new Date()
  const dates = []
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    dates.push({
      day: dayNames[date.getDay()],
      date: date.getDate(),
      available: false, // Will be updated based on schedules
    })
  }

  return dates
}

// Fungsi untuk memproses schedule dari backend
const processSchedules = (schedules: BackendSchedule[]): ProcessedSchedule => {
  console.log("🔄 Processing schedules:", schedules)

  // Generate dates for current week
  const dates = generateDatesForCurrentWeek()
  const timesMap = new Map<string, { time: string; scheduleId: number; available: boolean }>()

  // Process schedules to extract available times and mark dates as available
  schedules.forEach((schedule) => {
    // Validate schedule data
    if (!schedule || !schedule.start_time || typeof schedule.is_available !== "boolean") {
      console.warn("⚠️ Invalid schedule data:", schedule)
      return
    }

    console.log(
      `📅 Processing schedule: id=${schedule.id}, start_time=${schedule.start_time}, available=${schedule.is_available}`,
    )

    // Add time to times map
    const timeKey = schedule.start_time
    if (!timesMap.has(timeKey) || schedule.is_available) {
      timesMap.set(timeKey, {
        time: schedule.start_time,
        scheduleId: schedule.id,
        available: schedule.is_available,
      })
    }

    // For now, mark all dates as potentially available if we have any schedules
    // In a real app, you'd want to match schedules to specific dates
    if (schedule.is_available) {
      dates.forEach((date) => {
        date.available = true
      })
    }
  })

  const times = Array.from(timesMap.values()).sort((a, b) => a.time.localeCompare(b.time))

  console.log("📊 Processed dates:", dates)
  console.log("⏰ Processed times:", times)

  return { dates, times }
}

// API Service untuk create consultation dan cek verifikasi email
const createConsultation = async (
  doctor: DoctorDetail,
  selectedScheduleId: number,
  complaint: string,
): Promise<{ success: boolean; needsVerification: boolean; data?: any }> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    const url = `${API_BASE_URL}/doctors/create-consultation`

    console.log("🔍 Creating consultation:", url)

    // Find the selected schedule
    const selectedSchedule = doctor.schedules?.find((schedule) => schedule.id === selectedScheduleId)

    if (!selectedSchedule || !selectedSchedule.is_available) {
      throw new Error("Selected schedule not found or not available")
    }

    // Format date as YYYY-MM-DD (assuming current date for now)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const day = currentDate.getDate().toString().padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`

    const requestBody = {
      doctor_schedule_id: selectedScheduleId,
      fee: doctor.fee || 0,
      date: formattedDate,
    }

    console.log("📤 Request body:", requestBody)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })

    console.log("📡 Create consultation response status:", response.status)

    // Jika status 403, berarti email belum terverifikasi
    if (response.status === 403) {
      console.log("🚫 Email not verified - status 403")
      return { success: false, needsVerification: true }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ HTTP Error Detail:", {
        status: response.status,
        body: errorText,
      })
      throw new Error(`HTTP error! status: ${response.status}\n${errorText}`)
    }

    const data = await response.json()
    console.log("🧾 Create consultation response:", data)

    return { success: true, needsVerification: false, data: data }
  } catch (error: any) {
    console.error("🚨 Error creating consultation:", error.message || error)
    throw error
  }
}

export default function KonsultasiDetailPage() {
  const router = useRouter()
  const params = useLocalSearchParams()

  // Parse doctor data dari params
  const initialDoctor: Doctor = params.doctor
    ? JSON.parse(params.doctor as string)
    : {
        id: "1",
        name: "dr. Selvi",
        specialty: "Gizi Klinik",
        price: "Rp100.000",
        rating: "98%",
        image: null,
      }

  const [doctor, setDoctor] = useState<DoctorDetail>(initialDoctor)
  const [loading, setLoading] = useState(true)
  const [creatingConsultation, setCreatingConsultation] = useState(false)
  const [selectedDate, setSelectedDate] = useState(14)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null)
  const [complaint, setComplaint] = useState("")
  const [modalVisible, setModalVisible] = useState(false)

  // State untuk dates dan times yang akan diupdate dari backend
  const [dates, setDates] = useState([
    { day: "Min", date: 11, available: true },
    { day: "Sen", date: 12, available: true },
    { day: "Sel", date: 13, available: true },
    { day: "Rab", date: 14, available: true },
    { day: "Kam", date: 15, available: true },
    { day: "Jum", date: 16, available: true },
    { day: "Sab", date: 17, available: true },
  ])

  const [times, setTimes] = useState<Array<{ time: string; scheduleId: number; available: boolean }>>([])

  useEffect(() => {
    loadDoctorDetail()
  }, [])

  const loadDoctorDetail = async () => {
    try {
      setLoading(true)
      const doctorDetail = await fetchDoctorDetail(initialDoctor.id)
      setDoctor(doctorDetail)

      // Process schedules jika ada
      if (doctorDetail.schedules && doctorDetail.schedules.length > 0) {
        console.log("📋 Raw schedules from backend:", doctorDetail.schedules)

        const processedSchedule = processSchedules(doctorDetail.schedules)

        // Update dates and times
        if (processedSchedule.dates.length > 0) {
          setDates(processedSchedule.dates)

          // Set default selected date dari yang tersedia
          const firstAvailableDate = processedSchedule.dates.find((d) => d.available)
          if (firstAvailableDate) {
            setSelectedDate(firstAvailableDate.date)
          }
        }

        if (processedSchedule.times.length > 0) {
          setTimes(processedSchedule.times)

          // Set default selected time dari yang tersedia
          const firstAvailableTime = processedSchedule.times.find((t) => t.available)
          if (firstAvailableTime) {
            setSelectedTime(firstAvailableTime.time)
            setSelectedScheduleId(firstAvailableTime.scheduleId)
          }
        }
      } else {
        console.log("⚠️ No schedules found from backend, using default")
        // Keep default dates if no backend data
        setTimes([])
      }
    } catch (error) {
      console.error("❌ Error in loadDoctorDetail:", error)
      Alert.alert("Error", "Gagal memuat detail dokter. Silakan coba lagi.", [
        { text: "Retry", onPress: () => loadDoctorDetail() },
        { text: "Back", onPress: () => router.back() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async () => {
    try {
      setCreatingConsultation(true)

      // Validasi bahwa schedule yang dipilih tersedia
      if (!selectedScheduleId) {
        Alert.alert("Error", "Silakan pilih jadwal terlebih dahulu.")
        return
      }

      const selectedSchedule = doctor.schedules?.find((schedule) => schedule.id === selectedScheduleId)

      if (!selectedSchedule || !selectedSchedule.is_available) {
        Alert.alert("Error", "Jadwal yang dipilih tidak tersedia. Silakan pilih jadwal lain.")
        return
      }

      // Coba buat konsultasi
      const result = await createConsultation(doctor, selectedScheduleId, complaint)

      if (result.needsVerification) {
        // Jika status 403 (email belum terverifikasi), tampilkan modal
        setModalVisible(true)
      } else if (result.success) {
        // Jika berhasil, langsung ke detail reservasi
        router.push({
          pathname: "/konsultasi/detailreservasi",
          params: {
            doctor: JSON.stringify(doctor),
            selectedDate: selectedDate.toString(),
            selectedTime,
            complaint,
            isVerified: "true",
            consultationData: JSON.stringify(result.data),
          },
        })
      }
    } catch (error: any) {
      Alert.alert("Error", "Gagal membuat jadwal konsultasi. Silakan coba lagi.", [{ text: "OK" }])
    } finally {
      setCreatingConsultation(false)
    }
  }

  const handleVerify = () => {
    setModalVisible(false)
    // Kirim data yang diperlukan ke halaman verifikasi
    router.push({
      pathname: "/konsultasi/verifikasiemailpage",
      params: {
        doctor: JSON.stringify(doctor),
        selectedDate: selectedDate.toString(),
        selectedTime,
        complaint,
        returnTo: "detailreservasi",
      },
    })
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="p-4 bg-white">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft stroke="#000" width={24} height={24} />
            </TouchableOpacity>
            <Text className="text-lg font-medium ml-4">Detail Konsultan</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="text-gray-500 mt-2">Memuat detail dokter...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="p-4 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-4">Detail Konsultan</Text>
        </View>
      </View>

      <ScrollView>
        <View className="bg-white m-4 p-4 rounded-lg">
          <View className="items-center">
            <Image
              source={
                doctor.image && typeof doctor.image === "string"
                  ? { uri: doctor.image }
                  : doctor.image
                    ? doctor.image
                    : { uri: "https://via.placeholder.com/96x96/22C55E/FFFFFF?text=👩‍⚕️" }
              }
              className="w-24 h-24 rounded-lg"
            />
            <Text className="text-lg font-bold mt-2">{doctor.name}</Text>
            <View className="bg-green-50 px-3 py-1 rounded-full mt-1">
              <Text className="text-green-500">{doctor.specialty}</Text>
            </View>
          </View>

          <View className="mt-4 space-y-2">
            <View className="flex-row items-center">
              <Image source={require("../../assets/BuildIcon.png")} />
              <Text className="ml-2 text-gray-700">
                {doctor.hospital || doctor.workplace || "RSGM Universitas Indonesia"}
              </Text>
              <View className="ml-auto flex-row items-center">
                <ThumbsUp stroke="#666" width={16} height={16} />
                <Text className="ml-1">{doctor.likes || doctor.rating}</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Image source={require("../../assets/BagIcon.png")} />
              <Text className="ml-2 text-gray-700">
                {doctor.experience || `${doctor.year_experience || 5} Tahun Pengalaman`}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Image source={require("../../assets/MoneyIcon.png")} />
              <Text className="ml-2 text-gray-700">
                {doctor.price || (doctor.fee ? `Rp${doctor.fee.toLocaleString("id-ID")}` : "Rp100.000")}/sesi
              </Text>
            </View>
          </View>
        </View>

        {/* Jadwal Tersedia */}
        <View className="bg-white m-4 p-4 rounded-lg">
          <Text className="font-medium text-lg">Jadwal Tersedia</Text>
          <Text className="text-gray-500 mt-1 mb-4">Mei 2025</Text>

          {dates.length > 0 ? (
            <>
              {/* Grid tanggal dengan hari dan angka */}
              <View className="flex-row justify-between mb-6">
                {dates.map((item) => (
                  <View key={item.date} className="items-center">
                    <Text className="text-gray-500 mb-2">{item.day}</Text>
                    <TouchableOpacity
                      className={`items-center justify-center ${
                        selectedDate === item.date
                          ? "bg-green-500 w-10 h-10 rounded-full"
                          : item.available
                            ? ""
                            : "opacity-50"
                      }`}
                      onPress={() => {
                        if (item.available) {
                          setSelectedDate(item.date)
                          // Reset selected time when date changes
                          const firstAvailableTime = times.find((t) => t.available)
                          if (firstAvailableTime) {
                            setSelectedTime(firstAvailableTime.time)
                            setSelectedScheduleId(firstAvailableTime.scheduleId)
                          }
                        }
                      }}
                      disabled={!item.available}
                    >
                      <Text
                        className={`text-lg ${
                          selectedDate === item.date
                            ? "text-white font-bold"
                            : item.available
                              ? "text-black"
                              : "text-gray-400"
                        }`}
                      >
                        {item.date}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <Text className="font-medium text-gray-500 mb-3">Sesi Online</Text>

              {times.length > 0 ? (
                <View className="flex-row justify-between flex-wrap">
                  {times.map((timeSlot) => (
                    <TouchableOpacity
                      key={timeSlot.scheduleId}
                      className={`border rounded-full py-2 px-4 mb-2 ${
                        selectedTime === timeSlot.time && timeSlot.available
                          ? "bg-green-500 border-green-500"
                          : timeSlot.available
                            ? "border-gray-300"
                            : "border-gray-200 opacity-50"
                      }`}
                      onPress={() => {
                        if (timeSlot.available) {
                          setSelectedTime(timeSlot.time)
                          setSelectedScheduleId(timeSlot.scheduleId)
                        }
                      }}
                      disabled={!timeSlot.available}
                    >
                      <Text
                        className={`${
                          selectedTime === timeSlot.time && timeSlot.available
                            ? "text-white"
                            : timeSlot.available
                              ? "text-gray-700"
                              : "text-gray-400"
                        }`}
                      >
                        {timeSlot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View className="py-4">
                  <Text className="text-gray-500 text-center">Tidak ada slot waktu tersedia</Text>
                </View>
              )}
            </>
          ) : (
            <View className="py-8">
              <Text className="text-gray-500 text-center">Jadwal belum tersedia</Text>
              <Text className="text-gray-400 text-center text-sm mt-1">
                Silakan hubungi dokter untuk informasi jadwal
              </Text>
            </View>
          )}
        </View>

        <View className="bg-white m-4 p-4 rounded-lg">
          <Text className="font-medium mb-2">Keluhan</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 h-20"
            placeholder="Ketik di sini jika diperlukan"
            multiline
            value={complaint}
            onChangeText={setComplaint}
          />
        </View>
      </ScrollView>

      <View className="p-4 bg-white">
        <TouchableOpacity
          className={`py-4 rounded-lg items-center ${
            creatingConsultation || !selectedScheduleId ? "bg-gray-400" : "bg-green-500"
          }`}
          onPress={handleSchedule}
          disabled={creatingConsultation || !selectedScheduleId}
        >
          {creatingConsultation ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">Membuat Jadwal...</Text>
            </View>
          ) : (
            <Text className="text-white font-medium">
              {selectedScheduleId ? "Buat Jadwal" : "Pilih Jadwal Terlebih Dahulu"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <VerificationModal visible={modalVisible} onVerify={handleVerify} onLater={() => setModalVisible(false)} />
    </SafeAreaView>
  )
}
