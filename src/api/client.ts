import type { FoodItem, DroneTelemetry } from '../types'
import { FOOD_ITEMS } from '../data/foodData'

// Primary endpoint with Vite proxy or direct fallback
const BASE_URL = 'http://127.0.0.1:5000/api/v1'

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data?.error?.message || data?.message || 'Server error occurred')
    }
    return data.data !== undefined ? data.data : data
  } catch (err: any) {
    // If backend connection fails or offline, return safe fallback where appropriate
    console.warn(`[API Client Warning] Failed to reach ${endpoint}:`, err.message)
    throw err
  }
}

export const api = {
  // 1. Menu Catalog
  async getMenu(category?: string, search?: string): Promise<FoodItem[]> {
    try {
      const params = new URLSearchParams()
      if (category && category !== 'all') params.append('category', category)
      if (search) params.append('search', search)
      const query = params.toString() ? `?${params.toString()}` : ''
      return await request<FoodItem[]>(`/menu${query}`)
    } catch {
      // Graceful fallback to static data if backend is initializing
      return FOOD_ITEMS.filter((item) => {
        const matchesCategory = !category || category === 'all' || item.category === category
        const matchesSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
        return matchesCategory && matchesSearch
      })
    }
  },

  // 2. 3D Customizer Server-Side Calculation (Never trust frontend price calculation)
  async calculateCustomBurger(params: {
    baseFoodId: string
    pattyCount: 1 | 2 | 3
    cheeseType: string
    selectedToppings: string[]
  }): Promise<{
    basePrice: number
    extraPattyPrice: number
    toppingsPrice: number
    totalPrice: number
    totalCalories: number
    formattedSummary: string
  }> {
    return await request('/customizer/calculate', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  // 3. Promo Code Validation
  async validatePromoCode(code: string, subtotal: number): Promise<{
    isValid: boolean
    code: string
    discountAmount: number
    message: string
  }> {
    return await request('/promos/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    })
  },

  // 4. Place Order & Checkout
  async createOrder(data: {
    customerName: string
    customerEmail: string
    deliveryType: 'drone' | 'courier'
    deliveryAddress: string
    promoCode?: string
    items: Array<{
      foodId: string
      quantity: number
      pattyCount?: 1 | 2 | 3
      cheeseType?: string
      selectedToppings?: string[]
      specialInstructions?: string
    }>
  }): Promise<{
    id: string
    orderNumber: string
    subtotal: number
    deliveryFee: number
    discountAmount: number
    totalAmount: number
    status: string
    droneId: string
    etaMinutes: number
  }> {
    return await request('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // 5. VIP Newsletter Subscription
  async subscribeNewsletter(email: string): Promise<{ success: boolean; message: string }> {
    return await request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // 6. Live Drone Radar Stream (Server-Sent Events)
  subscribeDroneTelemetry(
    onData: (data: DroneTelemetry) => void,
    onError?: (err: any) => void
  ): () => void {
    let eventSource: EventSource | null = null
    let pollInterval: ReturnType<typeof setInterval> | null = null

    try {
      eventSource = new EventSource(`${BASE_URL}/telemetry/live`)

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as DroneTelemetry
          onData(parsed)
        } catch (e) {
          console.error('[SSE Parse Error]', e)
        }
      }

      eventSource.onerror = (err) => {
        if (eventSource) {
          eventSource.close()
          eventSource = null
        }
        onError?.(err)
        // Fallback to snapshot polling if SSE disconnects
        if (!pollInterval) {
          pollInterval = setInterval(async () => {
            try {
              const snapshot = await request<DroneTelemetry>('/telemetry/snapshot')
              onData(snapshot)
            } catch {
              // ignore
            }
          }, 3000)
        }
      }
    } catch (e) {
      onError?.(e)
    }

    return () => {
      if (eventSource) eventSource.close()
      if (pollInterval) clearInterval(pollInterval)
    }
  },

  // 7. System Health Check
  async checkHealth(): Promise<{ status: string; infrastructure: any }> {
    return await request('/health')
  },

  // 8. Orders Management (Admin / User)
  async getAllOrders(): Promise<any[]> {
    return await request('/orders')
  },

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return await request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  // 9. Menu Management (Admin)
  async updateMenuItem(id: string, updates: Partial<FoodItem>): Promise<FoodItem> {
    return await request(`/menu/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  },

  // 10. Authentication
  async login(email: string, password: string): Promise<any> {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async register(data: { email: string; password: string; fullName: string; phone?: string }): Promise<any> {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getProfile(): Promise<any> {
    const token = localStorage.getItem('nayeem_spices_token')
    return await request('/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
}
