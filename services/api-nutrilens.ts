// API service for backend communication
import type { FoodItem, Recipe } from "../utils/foodtypes"

const API_BASE_URL = "https://1335-118-99-68-242.ngrok-free.app" 

// Function to analyze food from image
export const analyzeFoodImage = async (imageUri: string): Promise<FoodItem[]> => {
  try {
    // Create form data to send the image
    const formData = new FormData()
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg", 
      name: "food_image.jpg",
    } as any)
    formData.append("scan_type", "nutriku") 
    // Send the image to the backend for analysis
    const response = await fetch(`${API_BASE_URL}/api/v1/gemini/analyze`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }

    const data = await response.json()
    return data.foods.map((food: any) => ({
      id: food.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: food.name,
      calories: food.calories,
      weight: food.weight,
      unit: food.unit || "g",
    }))
  } catch (error) {
    console.error("Error analyzing food image:", error)
    // Return empty array or throw error based on your error handling strategy
    throw error
  }
}

// // Function to analyze ingredients from image
// export const analyzeIngredientsImage = async (imageUri: string): Promise<FoodItem[]> => {
//   try {
//     // Create form data to send the image
//     const formData = new FormData()
//     formData.append("image", {
//       uri: imageUri,
//       type: "image/jpeg",
//       name: "ingredients_image.jpg",
//     } as any)

//     // Send the image to the backend for analysis
//     const response = await fetch(`${API_BASE_URL}/analyze-ingredients`, {
//       method: "POST",
//       body: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     })

//     if (!response.ok) {
//       throw new Error(`Server responded with ${response.status}`)
//     }

//     const data = await response.json()
//     return data.ingredients.map((ingredient: any) => ({
//       id: ingredient.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
//       name: ingredient.name,
//       calories: ingredient.calories,
//       weight: ingredient.weight,
//       unit: ingredient.unit || "g",
//     }))
//   } catch (error) {
//     console.error("Error analyzing ingredients image:", error)
//     throw error
//   }
// }

// // Function to get recipe recommendations based on ingredients
// export const getRecipeRecommendations = async (ingredients: FoodItem[]): Promise<Recipe[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/recipe-recommendations`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ ingredients }),
//     })

//     if (!response.ok) {
//       throw new Error(`Server responded with ${response.status}`)
//     }

//     const data = await response.json()
//     return data.recipes
//   } catch (error) {
//     console.error("Error getting recipe recommendations:", error)
//     throw error
//   }
// }

// // Function to save food history to backend
// export const saveFoodHistory = async (foods: FoodItem[], mealType: string): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/save-food-history`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         foods,
//         mealType,
//         timestamp: new Date().toISOString(),
//       }),
//     })

//     if (!response.ok) {
//       throw new Error(`Server responded with ${response.status}`)
//     }

//     return true
//   } catch (error) {
//     console.error("Error saving food history:", error)
//     return false
//   }
// }

// // Function to save recipe to user's history
// export const saveRecipeToUserHistory = async (recipe: Recipe): Promise<boolean> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/save-recipe-history`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ recipe }),
//     })

//     if (!response.ok) {
//       throw new Error(`Server responded with ${response.status}`)
//     }

//     return true
//   } catch (error) {
//     console.error("Error saving recipe to history:", error)
//     return false
//   }
// }

// Function to fetch user's food history
export const fetchFoodHistory = async (): Promise<FoodItem[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}`)

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }

    const data = await response.json()
    return data.foods
  } catch (error) {
    console.error("Error fetching food history:", error)
    return []
  }
}

// // Function to fetch user's recipe history
// export const fetchRecipeHistory = async (): Promise<Recipe[]> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/recipe-history`)

//     if (!response.ok) {
//       throw new Error(`Server responded with ${response.status}`)
//     }

//     const data = await response.json()
//     return data.recipes
//   } catch (error) {
//     console.error("Error fetching recipe history:", error)
//     return []
//   }
// }
