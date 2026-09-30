export type UserRole = 'CUSTOMER' | 'CHEF' | 'DISPATCHER' | 'ADMIN'

export interface User {
  id: string
  email: string
  passwordHash: string
  fullName: string
  phone?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  label: string
  streetAddress: string
  unitSuite: string
  city: string
  latitude: number
  longitude: number
  balconyPadEnabled: boolean
  deliveryNotes?: string
  createdAt: string
}

export interface Category {
  id: 'burgers' | 'pizza' | 'ramen' | 'sushi' | 'desserts' | string
  label: string
  displayOrder: number
  isActive: boolean
}

export interface FoodItem {
  id: string
  name: string
  tagline: string
  categoryId: string
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
  isAvailable?: boolean
}

export interface CustomizerOption {
  id: string
  optionType: 'patty' | 'cheese' | 'topping' | 'modal_extra'
  name: string
  additionalPrice: number
  calories: number
  isActive: boolean
}

export interface PromoCode {
  code: string
  discountAmount: number
  discountType: 'FIXED' | 'PERCENTAGE'
  minOrderSubtotal: number
  maxUses: number
  currentUses: number
  expiresAt?: string
  isActive: boolean
}

export type DeliveryType = 'drone' | 'courier'

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

export interface OrderItem {
  id: string
  orderId: string
  foodItemId: string
  itemName: string
  unitPrice: number
  quantity: number
  pattyCount?: number
  cheeseType?: string
  selectedToppings?: string[]
  specialInstructions?: string
  itemTotal: number
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  customerName: string
  customerEmail: string
  deliveryType: DeliveryType
  deliveryAddress: string
  subtotal: number
  deliveryFee: number
  discountAmount: number
  totalAmount: number
  promoCode?: string
  status: OrderStatus
  droneId?: string
  etaMinutes: number
  createdAt: string
  updatedAt: string
  items?: OrderItem[]
}

export interface Milestone {
  label: string
  completed: boolean
  timestamp: string
}

export interface DroneTelemetry {
  droneId: string
  status: 'idle' | 'assigned' | 'preparing' | 'in_flight' | 'descending' | 'delivered'
  altitudeMeters: number
  speedKmH: number
  podTemperature: number
  corridor: string
  etaMinutes: number
  distanceKm: number
  courierName: string
  destinationAddress: string
  milestones: Milestone[]
  timestamp: string
}

export interface Review {
  id: string
  name: string
  role: string
  avatar: string
  dish: string
  quote: string
  rating: number
  isCritic: boolean
  createdAt: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  tier: string
  subscribedAt: string
}
