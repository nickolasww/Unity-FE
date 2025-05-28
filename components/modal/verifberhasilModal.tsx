import { View, Text, Modal } from 'react-native';
import { Check } from 'react-native-feather';

const SuccessModal = ({ visible, onClose }: {
  visible: boolean;
  onClose: () => void;
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white rounded-lg p-8 w-10/12 items-center">
        {/* Icon Check dalam lingkaran hijau */}
        <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-4">
          <Check stroke="#FFFFFF" width={32} height={32} strokeWidth={3} />
        </View>
        
        <Text className="text-lg font-medium text-center text-gray-800">
          Verifikasi email berhasil!
        </Text>
      </View>
    </View>
  </Modal>
);

export default SuccessModal;