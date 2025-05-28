export interface PersonalizationTypes { 
    tanggalLahir: string; 
    jenisKelamin: string; 
    beratBadan: number;
    tinggiBadan:number; 
    aktivitasHarian: string; 
    kondisiKesehatan: string; 
    tujuanKesehatan: string;  
}

export interface PersonalizationBackendData { 
  birth_date: string 
  gender: string 
  weight: number
  height: number 
  sickness: string
  activity: string
  goal: string 
}

export interface BackendCalculationResult { 
    bmi: number; 
    bmiCategory: string; 
    bmiColor: string; 
    targetKaloriHarian: number; 
    rekomendasiNutrisi: { 
        protein: number; 
        karbohidrat: number;
        lemak: number;
    }
    rekomendasiAktivitas: string;
    pesan: string;
}

export interface ApiResponse<T> { 
    success: boolean;
    data: T;    
    message?: string;
}

export interface ActivityMapping {
  [key: string]: string
}

export interface GoalMapping {
  [key: string]: string
}

export interface ConditionMapping {
  [key: string]: string
}