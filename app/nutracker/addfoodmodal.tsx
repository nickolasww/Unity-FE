import type React from "react";
import { View, Text, Modal, TouchableOpacity, Image, TouchableWithoutFeedback} from "react-native";
import { Camera } from "lucide-react-native";
import { useRouter } from "expo-router";

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  mealType: string;
  onAddManual: (mealType: string) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  visible,
  onClose,
  mealType,
  onAddManual,
}) => {
  const handleAddManual = () => {
    onClose(); // Tutup modal ini
    onAddManual(mealType); // Buka bottom sheet
  };

  const router = useRouter();

  const handleGoToNutrilens = () => {
    router.push("/(tabs)/NutriLens");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
      <View className="flex-1 bg-black/50 " >
        <View className="flex-column justify-center items-center p-5 mx-5 my-32 bg-white rounded-2xl">
          <Image
            source={require("../../assets/NutrackerModal.png")}
            className="w-full rounded-xl"
            resizeMode="cover"
          />

          <TouchableOpacity
            className="mt-4 flex-row items-center justify-center p-3 border border-orange-500 rounded-lg w-full"
            onPress={() => {
              handleGoToNutrilens();
            }}
          >
            <Camera size={20} color="#FF5733" />
            <Text className="ml-2 text-orange-500 font-medium">
              Tambah dengan NutriLens
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-4 w-full">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400">Atau</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          <TouchableOpacity
            className="p-3 bg-orange-500 rounded-lg items-center w-full"
            onPress={handleAddManual}
          >
            <Text className="text-white font-medium">Tambah Manual</Text>
          </TouchableOpacity>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddFoodModal;
