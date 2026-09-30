import type { Request, Response } from 'express'
import { customizerService } from '../services/customizerService.js'
import { CustomizerCalculateSchema } from '../domain/validation.js'

export class CustomizerController {
  async getOptions(req: Request, res: Response) {
    const options = await customizerService.getOptions()
    res.status(200).json({
      success: true,
      data: options,
    })
  }

  async calculate(req: Request, res: Response) {
    const validated = CustomizerCalculateSchema.parse(req.body)
    const calculation = await customizerService.calculateCustomBurger(validated)
    res.status(200).json({
      success: true,
      data: calculation,
    })
  }
}

export const customizerController = new CustomizerController()
