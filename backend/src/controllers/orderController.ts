import type { Request, Response } from 'express'
import { orderService } from '../services/orderService.js'
import { CreateOrderSchema, UpdateOrderStatusSchema } from '../domain/validation.js'

export class OrderController {
  async createOrder(req: Request, res: Response) {
    const validated = CreateOrderSchema.parse(req.body)
    const order = await orderService.createOrder({
      ...validated,
      userId: req.user?.id,
    })
    res.status(201).json({
      success: true,
      message: 'Order placed and dispatched to Drone Pod successfully!',
      data: order,
    })
  }

  async getOrderById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const order = await orderService.getOrderById(id)
    res.status(200).json({
      success: true,
      data: order,
    })
  }

  async updateOrderStatus(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const validated = UpdateOrderStatusSchema.parse(req.body)
    const order = await orderService.updateOrderStatus(id, validated.status)
    res.status(200).json({
      success: true,
      message: `Order status transitioned to ${validated.status}`,
      data: order,
    })
  }
}

export const orderController = new OrderController()
