import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Modal } from 'react-native';

const VerificationModal = ({ visible, onVerify, onLater }: {
  visible: boolean;
  onVerify: () => void;
  onLater: () => void;
}) => (
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
            className="flex-1 border border-green-500 rounded-lg py-3 items-center mr-2" 
            onPress={onLater}
          >
            <Text className="text-green-500 font-medium">Nanti Saja</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-green-500 rounded-lg py-3 items-center ml-2" 
            onPress={onVerify}
          >
            <Text className="text-white font-medium">Verifikasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default VerificationModal;