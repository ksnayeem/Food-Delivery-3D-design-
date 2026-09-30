import { v4 as uuidv4 } from 'uuid'
import { inMemoryDb, pool, isPostgresConnected } from '../config/db.js'
import { menuService } from './menuService.js'
import { customizerService } from './customizerService.js'
import { promoService } from './promoService.js'
import { eventStream, TOPICS } from '../config/kafka.js'
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js'
import type { Order, OrderItem, OrderStatus, DeliveryType } from '../domain/types.js'

export class OrderService {
  async createOrder(params: {
    userId?: string
    customerName: string
    customerEmail: string
    deliveryType: DeliveryType
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
  }): Promise<Order> {
    if (!params.items || params.items.length === 0) {
      throw new ValidationError('An order must contain at least one item.')
    }

    const orderId = `ord-${uuidv4().slice(0, 8)}`
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`
    let subtotal = 0
    const processedItems: OrderItem[] = []

    // Server-side recalculation of every item
    for (const item of params.items) {
      const baseFood = await menuService.getItemById(item.foodId)
      let unitPrice = baseFood.price

      // If item was customized in 3D burger lab
      if (item.pattyCount && item.cheeseType) {
        const customCalc = await customizerService.calculateCustomBurger({
          baseFoodId: baseFood.id,
          pattyCount: item.pattyCount,
          cheeseType: item.cheeseType,
          selectedToppings: item.selectedToppings || [],
        })
        unitPrice = customCalc.totalPrice
      } else if (item.selectedToppings && item.selectedToppings.length > 0) {
        // Standard food with extra toppings from 3D Modal
        const toppingsCost = item.selectedToppings.length * 2.2
        unitPrice = parseFloat((baseFood.price + toppingsCost).toFixed(2))
      }

      const itemTotal = parseFloat((unitPrice * item.quantity).toFixed(2))
      subtotal += itemTotal

      processedItems.push({
        id: `item-${uuidv4().slice(0, 8)}`,
        orderId,
        foodItemId: baseFood.id,
        itemName: baseFood.name,
        unitPrice,
        quantity: item.quantity,
        pattyCount: item.pattyCount,
        cheeseType: item.cheeseType,
        selectedToppings: item.selectedToppings,
        specialInstructions: item.specialInstructions,
        itemTotal,
      })
    }

    subtotal = parseFloat(subtotal.toFixed(2))

    // Business rule: Free delivery for subtotal > $40
    let deliveryFee = 0
    if (subtotal > 40) {
      deliveryFee = 0
    } else {
      deliveryFee = params.deliveryType === 'drone' ? 3.99 : 2.5
    }

    // Business rule: Promo Code Discount
    let discountAmount = 0
    if (params.promoCode && params.promoCode.trim()) {
      try {
        const promoRes = await promoService.validatePromo(params.promoCode, subtotal)
        discountAmount = promoRes.discountAmount
      } catch {
        // invalid promo code ignored on checkout or applied as 0
        discountAmount = 0
      }
    }

    const totalAmount = parseFloat(Math.max(0, subtotal + deliveryFee - discountAmount).toFixed(2))
    const now = new Date().toISOString()

    const order: Order = {
      id: orderId,
      orderNumber,
      userId: params.userId,
      customerName: params.customerName.trim(),
      customerEmail: params.customerEmail.trim().toLowerCase(),
      deliveryType: params.deliveryType,
      deliveryAddress: params.deliveryAddress.trim(),
      subtotal,
      deliveryFee,
      discountAmount,
      totalAmount,
      promoCode: params.promoCode?.trim().toUpperCase(),
      status: 'CONFIRMED',
      droneId: 'POD-DRONE-X9',
      etaMinutes: 14,
      createdAt: now,
      updatedAt: now,
      items: processedItems,
    }

    // Save in database
    if (isPostgresConnected && pool) {
      await pool.query(
        `INSERT INTO orders 
        (id, order_number, user_id, customer_name, customer_email, delivery_type, delivery_address, subtotal, delivery_fee, discount_amount, total_amount, promo_code, status, drone_id, eta_minutes, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          order.id,
          order.orderNumber,
          order.userId || null,
          order.customerName,
          order.customerEmail,
          order.deliveryType,
          order.deliveryAddress,
          order.subtotal,
          order.deliveryFee,
          order.discountAmount,
          order.totalAmount,
          order.promoCode || null,
          order.status,
          order.droneId,
          order.etaMinutes,
          order.createdAt,
          order.updatedAt,
        ]
      )
    }
    inMemoryDb.orders.set(order.id, order)

    // Publish event to Kafka
    await eventStream.publish(TOPICS.ORDER_EVENTS, {
      eventType: 'ORDER_CREATED',
      orderId: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      deliveryType: order.deliveryType,
      droneId: order.droneId,
    })

    // Simulate autonomous flight progression in background
    this.scheduleOrderProgression(order.id)

    return order
  }

  async getAllOrders(): Promise<Order[]> {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM orders ORDER BY created_at DESC')
      return res.rows.map((r) => ({
        id: r.id,
        orderNumber: r.order_number,
        userId: r.user_id,
        customerName: r.customer_name,
        customerEmail: r.customer_email,
        deliveryType: r.delivery_type,
        deliveryAddress: r.delivery_address,
        subtotal: parseFloat(r.subtotal),
        deliveryFee: parseFloat(r.delivery_fee),
        discountAmount: parseFloat(r.discount_amount),
        totalAmount: parseFloat(r.total_amount),
        promoCode: r.promo_code,
        status: r.status,
        droneId: r.drone_id,
        etaMinutes: r.eta_minutes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }))
    }
    return Array.from(inMemoryDb.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async getOrderById(id: string): Promise<Order> {
    const order = inMemoryDb.orders.get(id)
    if (!order) {
      throw new NotFoundError(`Order with ID '${id}' not found.`)
    }
    return order
  }

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(id)
    order.status = newStatus
    order.updatedAt = new Date().toISOString()

    if (isPostgresConnected && pool) {
      await pool.query('UPDATE orders SET status = $1, updated_at = $2 WHERE id = $3', [
        newStatus,
        order.updatedAt,
        id,
      ])
    }

    // Publish state transition event to Kafka
    await eventStream.publish(TOPICS.ORDER_EVENTS, {
      eventType: 'ORDER_STATUS_CHANGED',
      orderId: order.id,
      newStatus,
    })

    return order
  }

  private scheduleOrderProgression(orderId: string) {
    const transitions: Array<{ status: OrderStatus; delayMs: number }> = [
      { status: 'KITCHEN_PREPARING', delayMs: 4000 },
      { status: 'PLATED', delayMs: 12000 },
      { status: 'HERMETICALLY_SEALED', delayMs: 20000 },
      { status: 'AIRBORNE', delayMs: 30000 },
    ]

    for (const step of transitions) {
      setTimeout(async () => {
        try {
          const ord = inMemoryDb.orders.get(orderId)
          if (ord && ord.status !== 'CANCELLED' && ord.status !== 'DELIVERED') {
            await this.updateOrderStatus(orderId, step.status)
          }
        } catch {
          // background simulation ignore
        }
      }, step.delayMs)
    }
  }
}

export const orderService = new OrderService()
