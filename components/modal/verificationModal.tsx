import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VerificationModalProps {
  visible: boolean;
  onVerify: () => void;
  onLater: () => void;
}

const API_BASE_URL = "https://nutripath.bccdev.id/api/v1";

const VerificationModal: React.FC<VerificationModalProps> = ({ visible, onVerify, onLater }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyEmail = async () => {   
    try {
      setIsLoading(true);
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token autentikasi tidak ditemukan");
      }
      
      console.log("Token tersedia, mengirim permintaan verifikasi email...");
      
      const response = await fetch(`${API_BASE_URL}/users/email-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      console.log("📡 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTP Error Detail:", {
          status: response.status,
          body: errorText,
        });
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error("Token tidak valid. Silakan login kembali.");
        } else if (response.status === 404) {
          throw new Error("Endpoint tidak ditemukan. Silakan hubungi support.");
        } else if (response.status === 400) {
          throw new Error("Permintaan tidak valid. Silakan coba lagi.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}\n${errorText}`);
        }
      }
      
      const data = await response.json();
      console.log("🧾 Email verification response:", data);
      
      // Tampilkan pesan sukses
      Alert.alert(
        "Berhasil",
        "Kode OTP telah dikirim ke email Anda. Silakan periksa inbox email.",
        [
          {
            text: "OK",
            onPress: () => {
              // Panggil callback onVerify untuk menutup modal
              onVerify();
              
              // Navigasi ke halaman verifikasi email
              setTimeout(() => {
                router.push({
                  pathname: "/konsultasi/verifikasiemailpage",
                  params: {
                    returnTo: "detailreservasi"
                  }
                });
              }, 300);
            }
          }
        ]
      );
      
    } catch (error: any) {
      console.error("🚨 Error saat verifikasi email:", error);
      
      let errorMessage = "Gagal mengirim kode verifikasi. Silakan coba lagi.";
      
      if (error.message.includes("Token tidak valid")) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
      } else if (error.message.includes("Endpoint tidak ditemukan")) {
        errorMessage = "Layanan tidak tersedia. Silakan hubungi support.";
      } else if (error.message.includes("Permintaan tidak valid")) {
        errorMessage = "Terjadi kesalahan dalam permintaan. Silakan coba lagi.";
      } else if (error.message.includes("Token autentikasi tidak ditemukan")) {
        errorMessage = "Anda belum login. Silakan login terlebih dahulu.";
      }
      
      Alert.alert(
        "Error",
        errorMessage,
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-10/12 items-center">
          <Image 
            source={require("../../assets/VerifImg.png")}
            className="w-40 h-40" 
            resizeMode="contain" 
          />
          <Text className="text-xl font-bold text-green-500 mt-4">Email Belum Terverifikasi</Text>
          <Text className="text-center mt-2 text-gray-700">
            Silahkan verifikasi email terlebih dahulu untuk dapat melakukan reservasi jadwal.
          </Text>
          <View className="flex-row w-full mt-6 space-x-2">
            <TouchableOpacity 
              className={`flex-1 border border-green-500 rounded-lg py-3 items-center mr-2 ${
                isLoading ? 'opacity-50' : ''
              }`}
              onPress={onLater}
              disabled={isLoading}
            >
              <Text className="text-green-500 font-medium">Nanti Saja</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 bg-green-500 rounded-lg py-3 items-center ml-2 ${
                isLoading ? 'opacity-75' : ''
              }`}
              onPress={handleVerifyEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text className="text-white font-medium ml-2">Mengirim...</Text>
                </View>
              ) : (
                <Text className="text-white font-medium">Verifikasi</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VerificationModal;