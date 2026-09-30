import type { Request, Response } from 'express'
import { promoService } from '../services/promoService.js'
import { PromoValidateSchema } from '../domain/validation.js'

export class PromoController {
  async validate(req: Request, res: Response) {
    const validated = PromoValidateSchema.parse(req.body)
    const result = await promoService.validatePromo(validated.code, validated.subtotal)
    res.status(200).json({
      success: true,
      data: result,
    })
  }
}

export const promoController = new PromoController()
