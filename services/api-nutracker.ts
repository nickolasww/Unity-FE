import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "https://nutripath.bccdev.id/api/v1"

// Define interfaces for API responses
interface ApiResponse<T> {
  message: string
  data?: T
  error?: string
}

interface TrackerData {
  user_id: string
  daily_calories: number
  daily_carbohydrate: number
  daily_protein: number
  daily_fat: number
  daily_fiber: number
  total_calories: number
  total_mass: number
  total_carbohydrate: number
  total_protein: number
  total_fat: number
  total_fiber: number
  total_breakfast_calories: number
  total_lunch_calories: number
  total_dinner_calories: number
  breakfast: FoodItem[]
  lunch: FoodItem[]
  dinner: FoodItem[] | null
}

interface FoodItem {
  id: number
  name: string
  calories: number
  carbohydrates: number
  protein: number
  fats: number
  fiber: number
  created_at: string
  steps?: string[]
  recipes?: string[]
  difficulty?: string
}

interface AddFoodRequest {
  name: string
  calories: number
  carbohydrates: number
  protein: number
  fats: number
  fiber: number
  date: string
  meal_type: "breakfast" | "lunch" | "dinner"
}

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = await AsyncStorage.getItem("authToken")
    const response = await fetch(`${API_BASE_URL}/trackers/get-tracker?date=2025-05-14`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// API functions
export const NutritionApi = {
  // Get nutrition tracker data for a specific date
  getTrackerData: async (date: string): Promise<TrackerData> => {
    const response = await fetchApi<TrackerData>(`/nutrition/tracker?date=${date}`)
    return response.data as TrackerData
  },

  // Add a new food item to a meal
  addFoodItem: async (foodData: AddFoodRequest): Promise<FoodItem> => {
    const response = await fetchApi<FoodItem>(`/nutrition/${foodData.meal_type}`, {
      method: "POST",
      body: JSON.stringify(foodData),
    })
    return response.data as FoodItem
  },

  // Delete a food item
  deleteFoodItem: async (itemId: number, mealType: string): Promise<void> => {
    await fetchApi(`/nutrition/${mealType}/${itemId}`, {
      method: "DELETE",
    })
  },

  // Update user's daily nutrition targets
  updateNutritionTargets: async (targets: {
    daily_calories: number
    daily_carbohydrate: number
    daily_protein: number
    daily_fat: number
    daily_fiber: number
  }): Promise<void> => {
    await fetchApi("/nutrition/targets", {
      method: "PUT",
      body: JSON.stringify(targets),
    })
  },
}

export default NutritionApi
