import * as ImagePicker from "expo-image-picker"
import type { FoodItem } from "../utils/foodtypes"

// Simulasi database makanan
const foodDatabase: Record<string, FoodItem> = {
  nasi_goreng: { id: "1", name: "Nasi Goreng", calories: 350, weight: 200, unit: "g" },
  telur_mata_sapi: { id: "2", name: "Telur Mata Sapi", calories: 90, weight: 1, unit: "butir" },
  udang: { id: "3", name: "Udang", calories: 30, weight: 30, unit: "g" },
  kerupuk: { id: "4", name: "Kerupuk", calories: 75, weight: 15, unit: "g" },
  nasi_putih: { id: "5", name: "Nasi Putih", calories: 350, weight: 200, unit: "g" },
}

export async function requestCameraPermission() {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  return status === "granted"
}

export async function takePicture() {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      return result.assets[0].uri
    }
    return null
  } catch (error) {
    console.error("Error taking picture:", error)
    return null
  }
}

// Simulasi pengenalan makanan dari gambar
export async function recognizeFood(imageUri: string): Promise<FoodItem | null> {
  // Dalam aplikasi nyata, ini akan memanggil API pengenalan gambar
  // Untuk demo, kita akan mengembalikan makanan acak dari database

  return new Promise((resolve) => {
    // Simulasi delay untuk proses pengenalan
    setTimeout(() => {
      const foodKeys = Object.keys(foodDatabase)
      const randomKey = foodKeys[Math.floor(Math.random() * foodKeys.length)]
      resolve(foodDatabase[randomKey])
    }, 2000)
  })
}

// Simulasi scan barcode untuk bahan makanan
export async function scanBarcode() {
  // Dalam aplikasi nyata, ini akan menggunakan scanner barcode
  // Untuk demo, kita akan mengembalikan bahan acak

  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(["Beras", "Telur", "Minyak", "Garam"])
    }, 1500)
  })
}

// Simulasi mendapatkan resep dari bahan-bahan
export async function getRecipesFromIngredients(ingredients: string[]) {
  // Dalam aplikasi nyata, ini akan memanggil API resep
  return new Promise<{ name: string; ingredients: string[] }[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: "Nasi Goreng Sederhana",
          ingredients: ["Beras", "Telur", "Minyak", "Garam", "Bawang"],
        },
        {
          name: "Telur Ceplok",
          ingredients: ["Telur", "Minyak", "Garam"],
        },
      ])
    }, 1500)
  })
}
