export interface FoodItem {
  id: string
  name: string
  tagline: string
  category: 'burgers' | 'pizza' | 'ramen' | 'sushi' | 'desserts'
  price: number
  rating: number
  reviewsCount: number
  prepTime: string
  calories: number
  spicyLevel: number
  isChefSpecial?: boolean
  isPopular?: boolean
  description: string
  ingredients: string[]
  image: string
  modelType: 'burger' | 'pizza' | 'ramen' | 'sushi'
}

export interface CartItem {
  food: FoodItem
  quantity: number
  selectedToppings?: string[]
  specialInstructions?: string
}

export interface DroneTelemetry {
  etaMinutes: number
  distanceKm: number
  podTemperature: number
  droneSpeedKmH: number
  currentStatus: 'preparing' | 'in_flight' | 'descending' | 'delivered'
  courierName: string
  droneId: string
}
