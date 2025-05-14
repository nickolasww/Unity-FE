export interface FoodItem {
    id: string
    name: string
    calories: number
    weight: number
    unit: string
  }

  export interface Recipe {
  id: string
  name: string
  calories: number
  weight: number
  unit: string
  image?: string
  nutritionDetails?: {
    carbs: number
    protein: number
    fat: number
    fiber: number
  }
  ingredients?: string[]
  cookTime?: string
  difficulty?: string
  steps?: string[] 
}

export const defaultRecipeData = { 
  nutritionDetails: { 
    carbs: 32, 
    protein: 13, 
    fat: 21, 
    fiber: 7, 
  },
  ingredients: [ 
    "2 lembar roti gandum utuh",
    "1/2 buah alpukat matang",
    "6-8 buah tomat ceri, dibelah dua",
    "1 butir telur",
    "1 sdt minyak zaitun (untuk menggoreng telur)",
    "Garam dan lada secukupnya",
    "Perasan air lemon (opsional)"
  ], 
  cookTime: "10 menit", 
  difficulty: " Mudah", 
}