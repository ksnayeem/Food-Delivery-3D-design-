import type { Request, Response } from 'express'
import { reviewService } from '../services/reviewService.js'
import { ReviewCreateSchema } from '../domain/validation.js'

export class ReviewController {
  async getReviews(req: Request, res: Response) {
    const reviews = await reviewService.getReviews()
    res.status(200).json({
      success: true,
      data: reviews,
    })
  }

  async addReview(req: Request, res: Response) {
    const validated = ReviewCreateSchema.parse(req.body)
    const review = await reviewService.addReview(validated)
    res.status(201).json({
      success: true,
      message: 'Review published successfully',
      data: review,
    })
  }
}

export const reviewController = new ReviewController()
