import type React from "react"
import { View, Text, Modal, Image } from "react-native"

interface SuccessModalProps {
  visible: boolean
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ visible }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} className="items-center justify-center">
        <View className="bg-white rounded-lg p-6 w-80 items-center">
          <Image
            source={require("../../assets/NutrackerImageModal.png")}
            className="w-40 h-40 mb-4"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold text-center mb-2">Asupan berhasil ditambahkan ke Nutracker</Text>
        </View>
      </View>
    </Modal>
  )
}
