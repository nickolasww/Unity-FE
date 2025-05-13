import type React from "react"
import { View, Text, TouchableOpacity, TextInput, Modal, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface AddItemModalProps {
  visible: boolean
  modalAnimation: Animated.Value
  showDetailFields: boolean
  newItemName: string
  newItemPortion: string
  newItemCalories: string
  newItemCarbs: string
  newItemProtein: string
  newItemFat: string
  newItemFiber: string
  activeTab: string
  onClose: () => void
  onNameChange: (value: string) => void
  onPortionChange: (value: string) => void
  onCaloriesChange: (value: string) => void
  onCarbsChange: (value: string) => void
  onProteinChange: (value: string) => void
  onFatChange: (value: string) => void
  onFiberChange: (value: string) => void
  onSearch: () => void
  onSave: () => void
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  modalAnimation,
  showDetailFields,
  newItemName,
  newItemPortion,
  newItemCalories,
  newItemCarbs,
  newItemProtein,
  newItemFat,
  newItemFiber,
  activeTab,
  onClose,
  onNameChange,
  onPortionChange,
  onCaloriesChange,
  onCarbsChange,
  onProteinChange,
  onFatChange,
  onFiberChange,
  onSearch,
  onSave,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: modalAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0],
                }),
              },
            ],
          }}
          className="bg-white rounded-t-3xl absolute bottom-0 left-0 right-0 p-5"
        >
          <View className="w-16 h-1 bg-gray-300 rounded-full self-center mb-4" />

          <Text className="text-lg font-semibold mb-4">Nama Item</Text>
          <View className="flex-row mb-6">
            <TextInput
              className="flex-1 bg-gray-100 rounded-l-lg px-4 py-3"
              placeholder="Misal: Sosis"
              value={newItemName}
              onChangeText={onNameChange}
            />
            <TouchableOpacity
              className="bg-orange-500 rounded-r-lg px-4 items-center justify-center"
              onPress={onSearch}
            >
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {showDetailFields && (
            <>
              <View className="mb-4">
                <Text className="mb-2">Porsi</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItemPortion}
                    onChangeText={onPortionChange}
                  />
                  <Text className="ml-2">g</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="mb-2">Kalori</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItemCalories}
                    onChangeText={onCaloriesChange}
                  />
                  <Text className="ml-2">kkal</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="mb-2">Karbohidrat</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItemCarbs}
                    onChangeText={onCarbsChange}
                  />
                  <Text className="ml-2">g</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="mb-2">Protein</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItemProtein}
                    onChangeText={onProteinChange}
                  />
                  <Text className="ml-2">g</Text>
                </View>
              </View>

              <View className="mb-4">
                <Text className="mb-2">Lemak</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItemFat}
                    onChangeText={onFatChange}
                  />
                  <Text className="ml-2">g</Text>
                </View>
              </View>

              <View className="mb-6">
                <Text className="mb-2">Serat</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-lg px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={newItemFiber}
                    onChangeText={onFiberChange}
                  />
                  <Text className="ml-2">g</Text>
                </View>
              </View>

              <TouchableOpacity className="bg-orange-500 rounded-lg py-4 items-center" onPress={onSave}>
                <Text className="text-white font-bold">Simpan</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  )
}
