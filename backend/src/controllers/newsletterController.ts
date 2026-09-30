import type { Request, Response } from 'express'
import { newsletterService } from '../services/newsletterService.js'
import { NewsletterSubscribeSchema } from '../domain/validation.js'

export class NewsletterController {
  async subscribe(req: Request, res: Response) {
    const validated = NewsletterSubscribeSchema.parse(req.body)
    const result = await newsletterService.subscribe(validated.email)
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    })
  }
}

export const newsletterController = new NewsletterController()
