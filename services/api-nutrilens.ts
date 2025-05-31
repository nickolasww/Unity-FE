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

     const responseClone = response.clone()

     const rawText = await responseClone.text()
    console.log("Raw API Response Text:", rawText)

     let data
    try {
      data = JSON.parse(rawText)
    } catch (e) {
      console.error("Error parsing JSON:", e)
      return []
    }

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
export const saveFoodHistory = async (foods: FoodItem[], meal_time: string, date?:string ): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("authToken")

    if (!token) {
      console.error("No auth token found")
      return false
    }

    // Extract only the food IDs from the foods array
    const foodIds = foods.map((food) => Number(food.id))

    const response = await fetch(`${API_BASE_URL}/foods/save-histories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
        body: JSON.stringify({
        meal_time,
        "food_ids": foodIds,
        "type": "nutriku",
        "date": date || new Date().toISOString().replace("T", " ").substring(0, 19),
      }),
    })

    console.log("Save food history response status:", response.status)

    // Baca response text sekali saja (tidak perlu clone)
    const responseText = await response.text()
    console.log("Raw save food history response:", responseText)

    if (!response.ok) {
      console.error(`Server responded with ${response.status}: ${responseText}`)
      return false
    }

    // Parse response jika ada content
    let responseData
    if (responseText.trim()) {
      try {
        responseData = JSON.parse(responseText)
        console.log("Save food history response data:", responseData)
      } catch (e) {
        console.error("Error parsing JSON from save food history response:", e)
        // Continue even if parsing fails - the save might still have succeeded
      }
    } else {
      console.log("Save food history response was empty")
    }

    // ✅ TAMBAHAN: Set flag refresh untuk NuTracker setelah berhasil menyimpan
    try {
      await AsyncStorage.setItem("needsRefresh", "true")
      await AsyncStorage.setItem("lastUpdateTime", Date.now().toString())
      console.log("✅ Refresh flag set successfully - NuTracker akan update data")
    } catch (flagError) {
      console.error("Error setting refresh flag:", flagError)
      // Tidak return false karena save sudah berhasil, hanya flag yang gagal
    }

    console.log("✅ Food history saved successfully")
    return true
  } catch (error) {
    console.error("❌ Error saving food history:", error)
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

     const responseClone = response.clone()

    // Log the raw response text for debugging
    const rawText = await responseClone.text()
    console.log("Raw API Response Text for ingredients:", rawText)

    let data
    try {
      data = JSON.parse(rawText)
    } catch (e) {
      console.error("Error parsing JSON for ingredients:", e)
      throw new Error("Invalid JSON response from server")
    }

    console.log("API Response Data for ingredients:", JSON.stringify(data, null, 2))

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
    console.log("Sending food IDs for recipe recommendations:", foodIds)

    const response = await fetch(`${API_BASE_URL}/gemini/create-food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        food_ids: foodIds,
      }),
    })

    // First, get the raw text response for debugging
    const responseText = await response.text()
    console.log("Raw recipe API response:", responseText)

    if (!response.ok) {
      console.error(`Server responded with ${response.status}`)
      return []
    }

    // Parse the response text manually since we already consumed the response body
    let data
    try {
      data = JSON.parse(responseText)
    } catch (error) {
      console.error("Error parsing recipe response JSON:", error)
      return []
    }

    console.log("Parsed recipe API response:", JSON.stringify(data, null, 2))

    // Extract the recipes array using a more robust approach
    let recipesArray = []

    if (data && typeof data === "object") {
      // Check all possible paths where recipes might be found
      if (data.data && Array.isArray(data.data)) {
        console.log("Found recipes in data path")
        recipesArray = data.data
      } else if (data.gemini && data.gemini.foods && Array.isArray(data.gemini.foods)) {
        console.log("Found recipes in gemini.foods path")
        recipesArray = data.gemini.foods
      } else if (data.foods && Array.isArray(data.foods)) {
        console.log("Found recipes in foods path")
        recipesArray = data.foods
      } else if (data.recipes && Array.isArray(data.recipes)) {
        console.log("Found recipes in recipes path")
        recipesArray = data.recipes
      } else {
        // Deep search for any array that might contain recipe data
        console.log("Performing deep search for recipes array")
        const findRecipesArray = (obj: any, path = ""): any[] | null => {
          if (!obj || typeof obj !== "object") return null

          // Check if this object has properties that look like a recipe
          if (obj.name && (obj.calories !== undefined || obj.ingredients !== undefined)) {
            console.log(`Found a single recipe object at ${path}`)
            return [obj]
          }

          // Check if this is an array of objects that look like recipes
          if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "object") {
            if (obj[0].name && (obj[0].calories !== undefined || obj[0].ingredients !== undefined)) {
              console.log(`Found recipes array at ${path}`)
              return obj
            }
          }

          // Recursively search nested objects
          for (const key in obj) {
            const result = findRecipesArray(obj[key], `${path}.${key}`)
            if (result) return result
          }

          return null
        }

        const result = findRecipesArray(data)
        if (result) {
          recipesArray = result
        }
      }
    }

    if (!recipesArray || recipesArray.length === 0) {
      console.warn("Could not find recipes array in response")
      return []
    }

    console.log(`Found ${recipesArray.length} recipes in response`)

    // Map the recipes array to our Recipe structure with better error handling
    const recipes = recipesArray
      .map((recipe: any, index: number) => {
        try {
          if (!recipe || typeof recipe !== "object") {
            console.warn(`Recipe at index ${index} is not an object:`, recipe)
            return null
          }

          console.log(`Processing recipe ${index}:`, recipe.name || "unnamed")

          return {
            id: recipe.id ? String(recipe.id) : String(Date.now() + Math.random() + index),
            name: recipe.name || `Recipe ${index + 1}`,
            calories: typeof recipe.calories === "number" ? recipe.calories : 0,
            weight: recipe.mass || recipe.weight || 0,
            unit: recipe.unit || "g",
            image: recipe.image || recipe.imageUrl || null,
            nutritionDetails: {
              carbs: recipe.carbohydrates || 0,
              protein: recipe.protein || 0,
              fat: recipe.fats || 0,
              fiber: recipe.fiber || 0,
            },
            ingredients: Array.isArray(recipe.ingredients)
              ? recipe.ingredients
              : Array.isArray(recipe.recipes)
                ? recipe.recipes
                : [],
            cookTime: recipe.cookTime || recipe.cook_time || "15 menit",
            difficulty: recipe.difficulty || "Medium",
            steps: Array.isArray(recipe.steps) ? recipe.steps : [],
          }
        } catch (error) {
          console.error(`Error mapping recipe at index ${index}:`, error)
          return null
        }
      })
      .filter(Boolean) as Recipe[] // Remove any null entries

    console.log(`Successfully mapped ${recipes.length} recipes`)
    return recipes
  } catch (error) {
    console.error("Error finding recipes:", error)
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

    const statusCode = response.status
    console.log("Save recipe response status:", statusCode)

    // Clone the response before reading it
    const responseClone = response.clone()

    // Read the response text
    const responseText = await responseClone.text()
    console.log("Raw save recipe response:", responseText)

     if (responseText.trim()) {
      try {
        const data = JSON.parse(responseText)
        console.log("Save recipe response data:", data)
      } catch (e) {
        console.error("Error parsing JSON from save recipe response:", e)
        // Continue even if parsing fails - the save might still have succeeded
      }
    } else {
      console.log("Save recipe response was empty")
    }

    return true
  } catch (error) {
    console.error("Error saving recipe to history:", error)
    return false
  }
}

