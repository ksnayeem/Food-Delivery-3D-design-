export type UserRole = 'CUSTOMER' | 'ADMIN' | 'CHEF' | 'DISPATCHER'

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'KITCHEN_PREPARING'
  | 'PLATED'
  | 'HERMETICALLY_SEALED'
  | 'AIRBORNE'
  | 'DESCENDING'
  | 'DELIVERED'
  | 'CANCELLED'

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
  isAvailable?: boolean
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
  speedKmH?: number
  altitudeMeters?: number
  corridor?: string
  currentStatus: 'preparing' | 'in_flight' | 'descending' | 'delivered'
  status?: string
  courierName: string
  droneId: string
  destinationAddress?: string
  milestones?: Array<{ label: string; completed: boolean; timestamp: string }>
  timestamp?: string
}

