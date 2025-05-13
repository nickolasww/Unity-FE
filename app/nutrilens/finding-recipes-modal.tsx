import type React from "react"
import { View, Text, Modal, Image, Animated } from "react-native"

interface FindingRecipesModalProps {
  visible: boolean
  spinAnimation: Animated.Value
}

export const FindingRecipesModal: React.FC<FindingRecipesModalProps> = ({ visible, spinAnimation }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} className="items-center justify-center">
        <View className="bg-white rounded-lg p-6 w-80 items-center">
          <View className="mb-4">
            <View className="w-10 h-10 items-center justify-center">
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: spinAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
                <Image source={require("../../assets/LoadingImg.png")} className="w-10 h-10" resizeMode="contain" />
              </Animated.View>
            </View>
          </View>
          <Text className="text-center mb-2">
            Tunggu sebentar, kami sedang mencari resep yang cocok dengan bahan-bahan kamu.
          </Text>
        </View>
      </View>
    </Modal>
  )
}
