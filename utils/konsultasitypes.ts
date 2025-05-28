export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  price: string;
  rating: string;
  image: any;
}

// Untuk Expo Router, kita tidak perlu RootStackParamList yang kompleks
// Karena routing sudah dihandle oleh file structure
export interface ConsultationParams {
  doctor?: Doctor;
  selectedDate?: number;
  selectedTime?: string;
  isVerified?: boolean;
}