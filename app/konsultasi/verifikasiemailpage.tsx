import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SuccessModal from '../../components/modal/verifberhasilModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "https://eace-2405-8740-6314-3409-592a-455a-e393-ad42.ngrok-free.app/api/v1";

const verifyOTP = async (otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const url = `${API_BASE_URL}/users/verify`;

    console.log("🔍 Verifying OTP:", url);
    console.log("📤 OTP:", otp);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otp }),
    });

    console.log("📡 Verify OTP response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Verify OTP Error:", {
        status: response.status,
        body: errorText,
      });
      
      if (response.status === 400) {
        throw new Error("Kode OTP tidak valid atau sudah expired");
      } else if (response.status === 401) {
        throw new Error("Session expired. Please login again");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log("🧾 Verify OTP response:", data);
    
    // Check for success response format: {"message": "success", "users": null}
    if (data.message === "success") {
      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message || "Verification failed" };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

// API Service untuk resend OTP
const resendOTP = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const url = `${API_BASE_URL}/users/email-verification`;

    console.log("🔍 Resending OTP:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    console.log("📡 Resend OTP response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Resend OTP Error:", {
        status: response.status,
        body: errorText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("✅ OTP resent successfully");
    return true;
  } catch (error) {
    console.error("Error resending OTP:", error);
    throw error;
  }
};

// Fungsi untuk mask email - menggunakan email dari AsyncStorage atau default
const getMaskedEmail = async (): Promise<string> => {
  try {
    // Coba ambil email dari AsyncStorage yang disimpan saat login atau dari VerificationModal
    const storedEmail = await AsyncStorage.getItem("userEmail");
    if (storedEmail) {
      return maskEmail(storedEmail);
    }

    // Jika tidak ada, gunakan email default
    return "user@example.com";
  } catch (error) {
    console.error("Error getting stored email:", error);
    return "user@example.com";
  }
};

// Fungsi untuk mask email
const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return 'user@example.com';
  }

  const [localPart, domain] = email.split('@');
  
  if (localPart.length <= 2) {
    return `${localPart[0]}*@${domain}`;
  }
  
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const maskedMiddle = '*'.repeat(Math.max(1, localPart.length - 2));
  
  return `${firstChar}${maskedMiddle}${lastChar}@${domain}`;
};

export default function VerifikasiEmailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMaskedEmail();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const loadMaskedEmail = async () => {
    try {
      setLoading(true);
      const email = await getMaskedEmail();
      setMaskedEmail(email);
    } catch (error) {
      console.error("Error loading masked email:", error);
      setMaskedEmail("user@example.com");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendOTP();
      setTimer(60);
      setOtp(''); // Reset OTP input
      Alert.alert('Sukses', 'Kode OTP baru telah dikirim ke email Anda.');
    } catch (error: any) {
      console.error("Error in handleResend:", error);
      
      let errorMessage = 'Gagal mengirim ulang kode OTP. Silakan coba lagi.';
      if (error.message.includes('401')) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const navigateToDetailReservasi = () => {
    // Cek apakah ada parameter untuk kembali ke halaman detail reservasi
    if (params.returnTo === 'detailreservasi' && params.doctor) {
      router.push({
        pathname: '/konsultasi/detailreservasi',
        params: {
          doctor: params.doctor as string,
          selectedDate: params.selectedDate as string,
          selectedTime: params.selectedTime as string,
          complaint: params.complaint as string,
          isVerified: 'true'
        }
      });
    } else {
      // Default navigation dengan data dummy jika tidak ada parameter
      const defaultDoctor = {
        id: '1',
        name: 'dr. Selvi',
        specialty: 'Gizi Klinik',
        price: 'Rp100.000',
        rating: '98%',
        image: null
      };

      router.push({
        pathname: '/konsultasi/detailreservasi',
        params: {
          doctor: JSON.stringify(defaultDoctor),
          selectedDate: '14',
          selectedTime: '14.00',
          complaint: '',
          isVerified: 'true'
        }
      });
    }
  };

  const handleSubmit = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert('Error', 'Masukkan kode OTP yang valid (6 digit).');
      return;
    }

    try {
      setIsVerifying(true);
      const result = await verifyOTP(otp);
      
      console.log("✅ Verification result:", result);
      
      if (result.success && result.message === "success") {
        console.log("🎉 OTP verification successful!");
        
        // Tampilkan modal sukses
        setShowSuccessModal(true);
        
        // Setelah 2 detik, tutup modal dan navigasi ke detail reservasi
        setTimeout(() => {
          setShowSuccessModal(false);
          setTimeout(() => {
            navigateToDetailReservasi();
          }, 300);
        }, 2000);
      } else {
        Alert.alert('Error', 'Kode OTP tidak valid. Silakan periksa kembali.');
        setOtp(''); // Reset OTP input
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      
      let errorMessage = 'Gagal memverifikasi kode OTP. Silakan coba lagi.';
      
      if (error.message.includes('tidak valid') || error.message.includes('expired')) {
        errorMessage = 'Kode OTP tidak valid atau sudah expired. Silakan minta kode baru.';
      } else if (error.message.includes('Session expired')) {
        errorMessage = 'Sesi Anda telah berakhir. Silakan login kembali.';
      }
      
      Alert.alert('Error', errorMessage);
      setOtp(''); // Reset OTP input
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle input OTP - hanya terima angka dan maksimal 6 digit
  const handleOtpChange = (value: string) => {
    // Hanya terima angka
    const numericValue = value.replace(/[^0-9]/g, '');
    // Maksimal 6 digit
    if (numericValue.length <= 6) {
      setOtp(numericValue);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="p-4">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft stroke="#000" width={24} height={24} />
            </TouchableOpacity>
            <Text className="text-lg font-medium ml-4">Verifikasi Email</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#22C55E" />
          <Text className="text-gray-500 mt-2">Memuat informasi...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft stroke="#000" width={24} height={24} />
          </TouchableOpacity>
          <Text className="text-lg font-medium ml-4">Verifikasi Email</Text>
        </View>
      </View>

      <View className="flex-1 px-4 pt-10">
        <Text className="text-center mb-4">
          Masukkan kode OTP yang telah kami kirimkan ke {maskedEmail}
        </Text>

        <View className="mt-10">
          <TextInput
            className="text-center text-3xl font-bold border-b border-gray-300 pb-2"
            value={otp}
            onChangeText={handleOtpChange}
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#D1D5DB"
            autoFocus={true}
            selectTextOnFocus={true}
          />
          <Text className="text-right mt-2">{formatTime(timer)}</Text>
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg items-center mt-10 ${
            isVerifying || otp.length < 6 ? 'bg-gray-400' : 'bg-green-500'
          }`}
          onPress={handleSubmit}
          disabled={isVerifying || otp.length < 6}
        >
          {isVerifying ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text className="text-white font-medium ml-2">Memverifikasi...</Text>
            </View>
          ) : (
            <Text className="text-white font-medium">
              {otp.length < 6 ? `Masukkan ${6 - otp.length} digit lagi` : 'Kirim'}
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Belum menerima kode OTP? </Text>
          <TouchableOpacity 
            onPress={handleResend} 
            disabled={timer > 0 || isResending}
          >
            {isResending ? (
              <ActivityIndicator size="small" color="#22C55E" />
            ) : (
              <Text className={`font-medium ${timer > 0 ? 'text-gray-400' : 'text-green-500'}`}>
                Kirim Ulang
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Sukses Verifikasi */}
      <SuccessModal 
        visible={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </SafeAreaView>
  );
}