import AsyncStorage from '@react-native-async-storage/async-storage';

interface PersonalizationBackendData {
  [key: string]: any; // Adjust the type based on your actual data structure
}

export class PersonalisasiApiService {
  private static baseUrl = "https://nutripath.bccdev.id/api/v1";

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static async createPersonalization(
    data: PersonalizationBackendData,
  ) {
    try {
    const token = await AsyncStorage.getItem("authToken")
      const response = await fetch(
        `${this.baseUrl}/users/create-personalization`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `HTTP error! status: ${response.status}`);
      }

      return { success: true, message: "Personalization created successfully" };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
}
