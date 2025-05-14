// API service for backend communication
import type { FoodItem, Recipe } from "../utils/foodtypes"
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "https://nutripath.bccdev.id/api/v1" 

// Function to analyze food from image
export const analyzeFoodImage = async (imageUri: string): Promise<FoodItem[]> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    // Create form data to send the image
    const formData = new FormData()
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "food_image.jpg",
    } as any)

    formData.append("scan_type", "nutriku")

    // Send the image to the backend for analysis
    const response = await fetch(`${API_BASE_URL}/gemini/analyze`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
         Authorization: `Bearer ${token}`,
      },
    })

    const responseText = await response.text();
    console.log("Raw API Response Text:", responseText);

    console.log("API Response Status:", response.status)

    if (!response.ok) {
      console.error(`Server responded with ${response.status}`)
      return [] 
    }

    const data = await response.json()
    console.log("API Response Data:", JSON.stringify(data, null, 2))

    let foodsArray = []

    if (data && typeof data === "object") {
      // Check for the specific structure in your API response
      if (data.gemini && data.gemini.ingredients && Array.isArray(data.gemini.ingredients)) {
        foodsArray = data.gemini.ingredients
      }
    }

    if (foodsArray.length === 0) {
      console.warn("Could not find foods array in response. Using empty array.")
    }

    return foodsArray.map((food: any) => ({
      id: food.id ? String(food.id) : String(Date.now() + Math.random()),
      name: food.name || "Unknown Food",
      calories: food.calories || 0,
      weight: food.mass || food.weight || 0, 
      unit: food.unit || "g",
      carbohydrates: food.carbohydrates || 0,
      protein: food.protein || 0,
      fats: food.fats || 0,
      fiber: food.fiber || 0,
    }))
  } catch (error) {
    console.error("Error analyzing food image:", error)
    return []
  }
}


// Function to save food history to backend
export const saveFoodHistory = async (foods: FoodItem[], meal_time: string): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    // Extract only the food IDs from the foods array
    const foodIds = foods.map((food) => Number(food.id))

    const response = await fetch(`${API_BASE_URL}/foods/save-histories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        meal_time,
        "food_ids": foodIds,
        "type": "nutriku",
        "date": new Date().toISOString() ,
      }),
    })

    const responseText = await response.text();
    console.log("Raw API Response Text:", responseText);

    console.log("Save food history response status:", response.status)

    if (!response.ok) {
      console.error(`Server responded with ${response.status}`)
      return false
    }

    const data = await response.json()
    console.log("Save food history response:", data)

    return true
  } catch (error) {
    console.error("Error saving food history:", error)
    return false
  }
}

// Function to analyze ingredients from image
export const analyzeIngredientsImage = async (imageUri: string): Promise<FoodItem[]> => {
  try {
    const token = await AsyncStorage.getItem("authToken")
    // Create form data to send the image
    const formData = new FormData()
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "ingredients_image.jpg",
    } as any)

     formData.append("scan_type", "resepku")

    // Send the image to the backend for analysis
    const response = await fetch(`${API_BASE_URL}/gemini/analyze`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    })

    const responseText = await response.text();
    console.log("Raw API Response Text:", responseText);

    if (!response.ok) {
      console.error(`Server responded with ${response.status}`)
      return [] 
    }

    const data = await response.json()
    console.log("API Response Data:", JSON.stringify(data, null, 2))

    let IngredientsArray = []

    if (data && typeof data === "object") {
      // Check for the specific structure in your API response
      if (data.gemini && data.gemini.ingredients && Array.isArray(data.gemini.ingredients)) {
        IngredientsArray = data.gemini.ingredients
      } 
    }

    if (IngredientsArray.length === 0) {
      console.warn("Could not find ingredients array in response. Using empty array.")
    }

    return IngredientsArray.map((food: any) => ({
      id: food.id ? String(food.id) : String(Date.now() + Math.random()),
      name: food.name || "Unknown Food",
      calories: food.calories || 0,
      weight: food.mass || food.weight || 0, 
      unit: food.unit || "g",
      carbohydrates: food.carbohydrates || 0,
      protein: food.protein || 0,
      fats: food.fats || 0,
      fiber: food.fiber || 0,
    }))
  } catch (error) {
    console.error("Error analyzing Ingredients image:")
    return []
  }
}

// Function to get recipe recommendations based on ingredients
export const getRecipeRecommendations = async (foods: FoodItem[]): Promise<Recipe[]> => {
  try {
    const token = await AsyncStorage.getItem("authToken")

    const foodIds = foods.map((food) => Number(food.id))

    const response = await fetch(`${API_BASE_URL}/gemini/create-food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({
        "food_ids": foodIds,
      }),
    })
    const responseText = await response.text();
    console.log("Raw API Response Text:", responseText);

    console.log("API Response Status:", response.status)

    if (!response.ok) {
      console.error(`Server responded with ${response.status}`)
      return [] 
    }

    const data = await response.json()
    console.log("API Response Data:", JSON.stringify(data, null, 2))
   let foodsArray = []

    if (data && typeof data === "object") {
      // Check specifically for the gemini.foods path first
      if (data.gemini && data.gemini.foods && Array.isArray(data.gemini.foods)) {
        console.log("Found recipes in gemini.foods path")
        foodsArray = data.gemini.foods
      } else if (data.foods && Array.isArray(data.foods)) {
        console.log("Found recipes in foods path")
        foodsArray = data.foods
      } else if (data.data && Array.isArray(data.data)) {
        console.log("Found recipes in data path")
        foodsArray = data.data
      } else {
        console.warn("Could not find foods array in expected paths, searching entire response")
        // Try to find any array that might contain recipe data
        for (const key in data) {
          if (data[key] && typeof data[key] === "object") {
            for (const subKey in data[key]) {
              if (Array.isArray(data[key][subKey]) && data[key][subKey].length > 0) {
                console.log(`Found potential recipes array in ${key}.${subKey}`)
                foodsArray = data[key][subKey]
                break
              }
            }
          }
        }
      }
    }

    if (!foodsArray || foodsArray.length === 0) {
      console.warn("Could not find foods array in response. Using empty array.")
      return []
    }

    console.log(`Found ${foodsArray.length} recipes in response`)

    // Map the foods array to our Recipe structure
    const recipes = foodsArray.map((food: any) => ({
      id: food.id ? String(food.id) : String(Date.now() + Math.random()),
      name: food.name || "Unknown Recipe",
      calories: food.calories || 0,
      weight: food.mass || food.weight || 0,
      unit: food.unit || "g",
      image: food.image || food.imageUrl || null,
      nutritionDetails: {
        carbs: food.carbohydrates || 0,
        protein: food.protein || 0,
        fat: food.fats || 0,
        fiber: food.fiber || 0,
      },
      ingredients: food.recipes || [], // Use the "recipes" field for ingredients
      cookTime: food.cookTime || food.cook_time || "15 menit",
      difficulty: food.difficulty || "Medium",
      steps: food.steps || [], // Add steps field
    }))

    console.log(`Mapped ${recipes.length} recipes successfully`)
    return recipes
  } catch (error) {
    console.error("Error finding recipes:", error)
    // Return empty array instead of throwing error
    return []
  }
}

// Function to save recipe to user's history
export const saveRecipeToUserHistory = async (foods: FoodItem[]): Promise<boolean> => {
  try {

    const token = await AsyncStorage.getItem("authToken")
    // Extract only the food IDs from the foods array
    const foodIds = foods.map((food) => Number(food.id))

    const response = await fetch(`${API_BASE_URL}/foods/add-bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ "food_ids": foodIds, }),
    })

    const responseText = await response.text();
    console.log("Raw API Response Text:", responseText);

     console.log("Save food history response status:", response.status)

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }

    const data = await response.json()
    console.log("Save food history response:", data)

    return true
  } catch (error) {
    console.error("Error saving recipe to history:", error)
    return false
  }
}

