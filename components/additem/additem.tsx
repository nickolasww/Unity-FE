"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  PanResponder,
} from "react-native"
import { Search } from "lucide-react-native"

interface FoodItem {
  name: string
  calories: number
  portion: number
  carbs: number
  protein: number
  fat: number
  fiber: number
}

interface AddItemSheetProps {
  visible: boolean
  onClose: () => void
  mealType: string
  onSave: (mealType: string, item: FoodItem) => void
  onReturn?: () => void // Prop baru untuk kembali ke modal pilihan
}

const AddItemSheet: React.FC<AddItemSheetProps> = ({ visible, onClose, mealType, onSave, onReturn }) => {
  const [name, setName] = useState("")
  const [portion, setPortion] = useState("")
  const [calories, setCalories] = useState("")
  const [carbs, setCarbs] = useState("")
  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [fiber, setFiber] = useState("")

  const screenHeight = Dimensions.get("window").height
  const translateY = useRef(new Animated.Value(screenHeight)).current

  // Untuk menangani gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Hanya aktifkan untuk gerakan vertikal ke bawah
        return gestureState.dy > 0
      },
      onPanResponderMove: (_, gestureState) => {
        // Hanya gerakkan jika ke bawah
        if (gestureState.dy > 5) {
          translateY.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Jika digeser ke bawah lebih dari 100, tutup sheet
        if (gestureState.dy > 5) {
          Animated.timing(translateY, {
            toValue: screenHeight,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onClose()
            // Jika onReturn tersedia, panggil untuk kembali ke modal pilihan
            if (onReturn) {
              setTimeout(() => {
                onReturn()
              }, 100)
            }
          })
        } else {
          // Jika tidak, kembalikan ke posisi awal
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 8,
          }).start()
        }
      },
    }),
  ).current

  useEffect(() => {
    if (visible) {
      // Reset form when opening
      resetForm()

      // Animate in
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start()
    } else {
      // Animate out
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [visible])

  const resetForm = () => {
    setName("")
    setPortion("")
    setCalories("")
    setCarbs("")
    setProtein("")
    setFat("")
    setFiber("")
  }

  const handleSave = () => {
    if (!name || !calories) {
      // Minimal validation
      alert("Nama item dan kalori harus diisi")
      return
    }

    const newItem: FoodItem = {
      name,
      portion: Number.parseFloat(portion) || 0,
      calories: Number.parseFloat(calories) || 0,
      carbs: Number.parseFloat(carbs) || 0,
      protein: Number.parseFloat(protein) || 0,
      fat: Number.parseFloat(fat) || 0,
      fiber: Number.parseFloat(fiber) || 0,
    }

    onSave(mealType, newItem)
    onClose()
  }

  if (!visible) return null

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="absolute inset-0 bg-black/30 justify-end">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="w-full">
          <Animated.View className="bg-white rounded-t-3xl p-4" style={{ transform: [{ translateY }] }} {...panResponder.panHandlers}>
            <View className="flex-row justify-center mb-2" >
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>

            <View className="mb-6">
              <Text className="text-lg font-medium mb-4">Nama Item</Text>
              <View className="flex-row">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3 mr-2"
                  placeholder="Misal: Sosis"
                  value={name}
                  onChangeText={setName}
                />
                <TouchableOpacity className="bg-orange-500 rounded-lg w-12 items-center justify-center">
                  <Search size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-medium mb-2">Porsi</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3"
                  placeholder="0"
                  keyboardType="numeric"
                  value={portion}
                  onChangeText={setPortion}
                />
                <Text className="ml-2 text-lg">g</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-medium mb-2">Kalori</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3"
                  placeholder="0"
                  keyboardType="numeric"
                  value={calories}
                  onChangeText={setCalories}
                />
                <Text className="ml-2 text-lg">kkal</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-medium mb-2">Karbohidrat</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3"
                  placeholder="0"
                  keyboardType="numeric"
                  value={carbs}
                  onChangeText={setCarbs}
                />
                <Text className="ml-2 text-lg">g</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-medium mb-2">Protein</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3"
                  placeholder="0"
                  keyboardType="numeric"
                  value={protein}
                  onChangeText={setProtein}
                />
                <Text className="ml-2 text-lg">g</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-lg font-medium mb-2">Lemak</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3"
                  placeholder="0"
                  keyboardType="numeric"
                  value={fat}
                  onChangeText={setFat}
                />
                <Text className="ml-2 text-lg">g</Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-medium mb-2">Serat</Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-blue-50 rounded-lg p-3"
                  placeholder="0"
                  keyboardType="numeric"
                  value={fiber}
                  onChangeText={setFiber}
                />
                <Text className="ml-2 text-lg">g</Text>
              </View>
            </View>

            <TouchableOpacity className="bg-orange-300 rounded-lg p-4 items-center" onPress={handleSave}>
              <Text className="text-white font-bold text-lg">Simpan</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default AddItemSheet
