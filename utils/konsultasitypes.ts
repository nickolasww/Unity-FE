export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  price: string;
  rating: string;
  image: any;
}

export interface ConsultationParams {
  doctor?: Doctor;
  selectedDate?: number;
  selectedTime?: string;
  isVerified?: boolean;
}
