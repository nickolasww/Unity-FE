import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Image, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar, Check } from 'react-native-feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import 'nativewind';
import { useRouter } from 'expo-router';

export default function PersonalisasiPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  
  // Form data state
  const [formData, setFormData] = useState({
    tanggalLahir: '',
    jenisKelamin: '',
    beratBadan: '',
    tinggiBadan: '',
    aktivitasHarian: '',
    kondisiKesehatan: [],
    kondisiKesehatanLainnya: '',
    tujuanKesehatan: '',
  });

  const HandleToGoNuTracker = () => { 
    router.push('/(tabs)/NuTracker');
  }

    const handleLewati = () => {
      router.push("/(tabs)/beranda");
    }

  // Calculate BMI
  const calculateBMI = () => {
    if (!formData.beratBadan || !formData.tinggiBadan) return 0;
    
    const weight = parseFloat(formData.beratBadan);
    const height = parseFloat(formData.tinggiBadan) / 100; // convert cm to m
    return (weight / (height * height)).toFixed(1);
  };

  // Get BMI category
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Berat badan kurang', color: '#3ABFF8' };
    if (bmi < 25) return { category: 'Berat badan normal', color: '#36D399' };
    if (bmi < 30) return { category: 'Kelebihan berat badan', color: '#FBBD23' };
    if (bmi < 35) return { category: 'Obesitas kelas I', color: '#F87C37' };
    if (bmi < 40) return { category: 'Obesitas kelas II', color: '#F87272' };
    return { category: 'Obesitas kelas III', color: '#881337' };
  };

  // Handle form submission
  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSummary(true);
    }, 2000);
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (showSummary) {
      setShowSummary(false);
      setCurrentStep(4);
    }
  };

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    // Format date as DD/MM/YYYY
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    
    const formattedDate = `${day}/${month}/${year}`;
    
    setFormData({
      ...formData,
      tanggalLahir: formattedDate
    });
  };

  // Handle checkbox selection
  const handleCheckboxChange = (value) => {
    if (value === 'Tidak ada') {
      setFormData({
        ...formData,
        kondisiKesehatan: ['Tidak ada'],
      });
      return;
    }
    
    let newKondisiKesehatan = [...formData.kondisiKesehatan];
    
    // Remove "Tidak ada" if it exists
    if (newKondisiKesehatan.includes('Tidak ada')) {
      newKondisiKesehatan = newKondisiKesehatan.filter(item => item !== 'Tidak ada');
    }
    
    // Toggle the selected value
    if (newKondisiKesehatan.includes(value)) {
      newKondisiKesehatan = newKondisiKesehatan.filter(item => item !== value);
    } else {
      newKondisiKesehatan.push(value);
    }
    
    setFormData({
      ...formData,
      kondisiKesehatan: newKondisiKesehatan,
    });
  };

  // Handle radio selection
  const handleRadioChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Render progress steps
  const renderProgressSteps = () => {
    return (
      <View className="flex-row items-center justify-center mt-4 mb-8 px-4">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <View 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step < currentStep || (step === currentStep && !showSummary) 
                  ? 'bg-orange-500' 
                  : 'bg-gray-200'
              }`}
            >
              {step < currentStep ? (
                <Check width={16} height={16} color="white" />
              ) : (
                <Text className={`text-sm font-bold ${
                  step === currentStep && !showSummary ? 'text-white' : 'text-gray-500'
                }`}>
                  {step}
                </Text>
              )}
            </View>
            
            {step < 4 && (
              <View 
                className={`h-0.5 w-8 ${
                  step < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                }`} 
              />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  // Render checkbox
  const renderCheckbox = (value, label, description = '') => {
    const isChecked = formData.kondisiKesehatan.includes(value);
    
    return (
      <TouchableOpacity 
        className={`flex-row items-center border-b border-gray-200 p-4 ${isChecked ? 'bg-orange-50' : ''}`}
        onPress={() => handleCheckboxChange(value)}
      >
        <View className={`w-5 h-5 rounded border ${isChecked ? 'bg-orange-500 border-orange-500' : 'border-gray-300'} mr-3`}>
          {isChecked && <Check width={16} height={16} color="white" />}
        </View>
        <View>
          <Text className="text-base">{label}</Text>
          {description ? <Text className="text-gray-500 text-sm">{description}</Text> : null}
        </View>
      </TouchableOpacity>
    );
  };

  // Render radio button
  const renderRadioButton = (field, value, label, description = '', emoji = '') => {
    const isSelected = formData[field] === value;
    
    return (
      <TouchableOpacity 
        className={`flex-row items-center border-b border-gray-200 p-4 ${isSelected ? 'bg-orange-50' : ''}`}
        onPress={() => handleRadioChange(field, value)}
      >
        <View className="flex-row items-center">
          <View className={`w-5 h-5 rounded-full border ${isSelected ? 'border-orange-500' : 'border-gray-300'} mr-3`}>
            {isSelected && (
              <View className="w-3 h-3 rounded-full bg-orange-500 absolute top-1 left-1" />
            )}
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className={`text-base ${isSelected ? 'text-orange-500 font-medium' : ''}`}>
                {label}
              </Text>
              {emoji ? <Text className="ml-1">{emoji}</Text> : null}
            </View>
            {description ? <Text className="text-gray-500 text-sm">{description}</Text> : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
            onChangeText={(text) => setFormData({...formData, tanggalLahir: text})}
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Calendar width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        
        {/* Date Picker for iOS */}
        {Platform.OS === 'ios' && showDatePicker && (
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
                  <TouchableOpacity 
                    onPress={() => {
                      setShowDatePicker(false);
                    }}
                  >
                    <Text className="text-orange-500 text-base">Selesai</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={formData.tanggalLahir ? new Date(formData.tanggalLahir.split('/').reverse().join('-')) : new Date()}
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
        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={formData.tanggalLahir ? new Date(formData.tanggalLahir.split('/').reverse().join('-')) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
        
        <Text className="text-xl font-bold mb-4">Jenis Kelamin</Text>
        <View className="border rounded-lg mb-6 overflow-hidden">
          {renderRadioButton('jenisKelamin', 'Perempuan', 'Perempuan')}
          {renderRadioButton('jenisKelamin', 'Laki-Laki', 'Laki-Laki')}
        </View>
        
        <Text className="text-xl font-bold mb-4">Berat Badan (Kg)</Text>
        <TextInput
          className="border rounded-lg mb-6 px-4 py-3 text-base"
          placeholder="Misal: 50"
          keyboardType="numeric"
          value={formData.beratBadan}
          onChangeText={(text) => setFormData({...formData, beratBadan: text})}
        />
        
        <Text className="text-xl font-bold mb-4">Tinggi Badan (cm)</Text>
        <TextInput
          className="border rounded-lg mb-6 px-4 py-3 text-base"
          placeholder="Misal: 160"
          keyboardType="numeric"
          value={formData.tinggiBadan}
          onChangeText={(text) => setFormData({...formData, tinggiBadan: text})}
        />
      </View>
    );
  };

  // Render step 2 - Daily Activity
  const renderStep2 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Aktivitas Harian</Text>
        <View className="border rounded-lg overflow-hidden">
          {renderRadioButton(
            'aktivitasHarian', 
            'Kurang Gerak', 
            'Kurang Gerak', 
            '(tidak berolahraga, kerja di balik meja)',
            '🧍'
          )}
          {renderRadioButton(
            'aktivitasHarian', 
            'Aktif Ringan', 
            'Aktif Ringan', 
            '(berjalan santai, pekerjaan rumah ringan)',
            '🚶'
          )}
          {renderRadioButton(
            'aktivitasHarian', 
            'Cukup Aktif', 
            'Cukup Aktif', 
            '(banyak gerak tapi tidak terlalu berat)',
            '🚶‍♀️'
          )}
          {renderRadioButton(
            'aktivitasHarian', 
            'Sangat Aktif', 
            'Sangat Aktif', 
            '(rutin olahraga atau kerja fisik)',
            '🏃'
          )}
          {renderRadioButton(
            'aktivitasHarian', 
            'Super Aktif', 
            'Super Aktif', 
            '(aktivitas fisik sangat intens setiap hari)',
            '🏋️'
          )}
        </View>
      </View>
    );
  };

  // Render step 3 - Health Conditions
  const renderStep3 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Kondisi Kesehatan Khusus</Text>
        <View className="border rounded-lg overflow-hidden">
          {renderCheckbox('Tidak ada', 'Tidak ada')}
          {renderCheckbox('Diabetes', 'Diabetes')}
          {renderCheckbox('Hipertensi', 'Hipertensi')}
          {renderCheckbox('Kolesterol tinggi', 'Kolesterol tinggi')}
          {renderCheckbox('Gangguan ginjal', 'Gangguan ginjal')}
          <View className="flex-row items-center border-b border-gray-200 p-4">
            <View className={`w-5 h-5 rounded border border-gray-300 mr-3`} />
            <TextInput
              className="flex-1 text-base"
              placeholder="Lainnya: _______"
              value={formData.kondisiKesehatanLainnya}
              onChangeText={(text) => setFormData({...formData, kondisiKesehatanLainnya: text})}
            />
          </View>
        </View>
      </View>
    );
  };

  // Render step 4 - Health Goals
  const renderStep4 = () => {
    return (
      <View className="px-4">
        <Text className="text-xl font-bold mb-4">Tujuan Kesehatan</Text>
        <View className="border rounded-lg overflow-hidden">
          {renderRadioButton('tujuanKesehatan', 'Menurunkan berat badan', 'Menurunkan berat badan')}
          {renderRadioButton('tujuanKesehatan', 'Menjaga berat badan', 'Menjaga berat badan')}
          {renderRadioButton('tujuanKesehatan', 'Menambah massa otot', 'Menambah massa otot')}
          {renderRadioButton('tujuanKesehatan', 'Menambah berat badan', 'Menambah berat badan')}
        </View>
      </View>
    );
  };

  // Render loading screen
  const renderLoading = () => {
    return (
      <View className="flex-1 items-center justify-center bg-white/80 absolute inset-0">
        <View className="bg-white p-8 rounded-lg shadow-md items-center">
          <ActivityIndicator size="large" color="#F97316" />
          <Text className="mt-4 text-base">Tunggu sebentar yaa</Text>
        </View>
      </View>
    );
  };

  // Render summary screen
  const renderSummary = () => {
    const bmi = calculateBMI();
    const bmiInfo = getBMICategory(bmi);
    
    // Calculate age from birth date
    const calculateAge = () => {
      if (!formData.tanggalLahir) return 20; // Default age
      
      try {
        const parts = formData.tanggalLahir.split('/');
        const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        return age;
      } catch (e) {
        return 20; // Default age on error
      }
    };
    
    return (
      <ScrollView className="px-4">
        <Text className="text-2xl font-bold text-center mb-4">Ringkasan</Text>
        
        {/* User Info Card */}
        <View className="bg-orange-50 rounded-lg pt-6 px-6 mb-4 ">
          <View className="flex-row">
            <View className="flex-1">
              <View className="flex-row mb-4">
                <View className="flex-1">
                  <Text className="font-bold mb-1">• Usia</Text>
                  <Text className="text-lg">{calculateAge()}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="font-bold mb-1">• Jenis Kelamin</Text>
                  <Text className="text-lg">{formData.jenisKelamin}</Text>
                </View>
              </View>
              
              <View className="flex-row">
                <View className="flex-1">
                  <Text className="font-bold mb-1">• Berat Badan</Text>
                  <Text className="text-lg">{formData.beratBadan}</Text>
                </View>
                
                <View className="flex-1">
                  <Text className="font-bold mb-1">• Tinggi Badan</Text>
                  <Text className="text-lg">{formData.tinggiBadan}</Text>
                </View>
              </View>
            </View>
            
            <View className="w-1/4 items-end">
              <Image
                source={require('../../assets/HumanBmi.png')}
                className="w-full h-40"
              />
            </View>
          </View>
        </View>
        
        {/* BMI Card */}
        <View className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          <Text className="text-xl font-bold text-center mb-2">BMI Kamu</Text>
          <Text className="text-4xl font-bold text-center mb-2">{bmi}</Text>
          
          <View className="flex-row items-center justify-center mb-4">
            <View className="w-3 h-3 rounded-full" style={{ backgroundColor: bmiInfo.color }} />
            <Text className="ml-2">{bmiInfo.category}</Text>
          </View>
          
          {/* BMI Scale */}
          <View className="h-2 flex-row rounded-full overflow-hidden mb-4">
            <View className="flex-1 bg-blue-400" />
            <View className="flex-1 bg-green-400" />
            <View className="flex-1 bg-yellow-400" />
            <View className="flex-1 bg-orange-400" />
            <View className="flex-1 bg-red-500" />
            <View className="flex-1 bg-red-900" />
          </View>
          
          {/* BMI Legend */}
          <View className="">
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full bg-blue-400 mr-1" />
              <Text className="text-xs">BMI {'<'} 18,5</Text>
            <View className="ml-14">
              <Text className="text-xs">Berat badan kurang</Text>
            </View>
            </View>
            
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full bg-green-400 mr-1" />
              <Text className="text-xs">18,5 - 24,9</Text>
            <View className="ml-14">
              <Text className="text-xs">Berat badan normal</Text>
            </View>
            </View>
            
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full bg-yellow-400 mr-1" />
              <Text className="text-xs">25 - 29,9</Text>
            <View className="ml-16">
              <Text className="text-xs">Kelebihan berat badan</Text>
            </View>
            </View>
            
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full bg-orange-400 mr-1" />
              <Text className="text-xs">30 - 34,9</Text>
            <View className="ml-16">
              <Text className="text-xs">Obesitas kelas I</Text>
            </View>
            </View>
            
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-1" />
              <Text className="text-xs">35 - 39,9</Text>
            <View className="ml-16">
              <Text className="text-xs">Obesitas kelas II</Text>
            </View>
            </View>
            
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full bg-red-900 mr-1" />
              <Text className="text-xs">BMI {'>'} 39,9</Text>
            <View className="ml-14">
              <Text className="text-xs">Obesitas kelas III</Text>
            </View>
            </View>
          </View>
        </View>
        
        {/* Info Card */}
        <View className="flex-row items-center bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <View className="w-6 h-6 rounded-full bg-amber-400 items-center justify-center mr-2">
            <Text className="text-white font-bold">!</Text>
          </View>
          <Text className="flex-1 text-amber-800 text-sm">
            Kami telah menetapkan target kalori harian berdasarkan informasi yang kamu berikan. Jelajahi NuTracker untuk melihat rincian lengkapnya.
          </Text>
        </View>
        
        {/* NuTracker Button */}
        <TouchableOpacity className="bg-white border border-orange-500 rounded-lg p-4 mb-8 flex-row items-center justify-center" onPress={HandleToGoNuTracker}>
          <Text className="text-orange-500 font-medium mr-2">Lihat NuTracker</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    if (showSummary) {
      return renderSummary();
    }
    
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-end p-4">
        {!showSummary && (
          <TouchableOpacity onPress={handleLewati}>
            <Text className="text-gray-500">Lewati</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Progress Steps (only show in personalization screens) */}
      {!showSummary && renderProgressSteps()}
      
      {/* Content */}
      <ScrollView className="flex-1">
        {renderStepContent()}
      </ScrollView>
      
      {/* Footer Button */}
      {!showSummary && (
        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity 
            className="bg-orange-500 rounded-lg py-4 items-center"
            onPress={handleNext}
          >
            <Text className="text-white font-bold text-base">
              {currentStep === 4 ? 'Kirim' : 'Lanjut'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Loading Overlay */}
      {isLoading && renderLoading()}
    </SafeAreaView>
  );
}