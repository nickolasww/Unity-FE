import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { ArrowLeft, Check } from 'react-native-feather';
import { useRouter } from 'expo-router';
import SuccessModal  from '../../components/modal/verifberhasilModal'; 


export default function VerifikasiEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('300425');
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    setIsResending(true);
    // Simulate API call
    setTimeout(() => {
      setTimer(60);
      setIsResending(false);
    }, 1000);
  };

  const handleSubmit = () => {
    // Tampilkan modal sukses
    setShowSuccessModal(true);
    
    // Setelah 2 detik, tutup modal dan navigasi ke DetailReservasi
    setTimeout(() => {
      setShowSuccessModal(false);
      setTimeout(() => {
        router.push({
          pathname: '/konsultasi/detailreservasi',
          params: {
            doctor: JSON.stringify({
              id: '1',
              name: 'dr. Selvi',
              specialty: 'Gizi Klinik',
              price: 'Rp100.000',
              rating: '98%',
              image: null
            }),
            isVerified: 'true'
          }
        });
      }, 300); // Delay kecil untuk transisi yang smooth
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-10">
        <Text className="text-center mb-4">
          Masukkan kode OTP yang telah kami kirimkan ke r********a@gmail.com
        </Text>

        <View className="mt-10">
          <TextInput
            className="text-center text-3xl font-bold border-b border-gray-300 pb-2"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Text className="text-right mt-2">{formatTime(timer)}</Text>
        </View>

        <TouchableOpacity
          className="bg-green-500 py-4 rounded-lg items-center mt-10"
          onPress={handleSubmit}
        >
          <Text className="text-white font-medium">Kirim</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">Belum menerima kode OTP? </Text>
          <TouchableOpacity 
            onPress={handleResend} 
            disabled={timer > 0 || isResending}
          >
            <Text className={`font-medium ${timer > 0 || isResending ? 'text-gray-400' : 'text-green-500'}`}>
              Kirim Ulang
            </Text>
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