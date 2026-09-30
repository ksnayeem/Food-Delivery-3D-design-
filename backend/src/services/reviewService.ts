import { v4 as uuidv4 } from 'uuid'
import { inMemoryDb } from '../config/db.js'
import type { Review } from '../domain/types.js'

export class ReviewService {
  async getReviews(): Promise<Review[]> {
    return inMemoryDb.reviews
  }

  async addReview(data: { name: string; role: string; dish: string; quote: string; rating: number }): Promise<Review> {
    const newReview: Review = {
      id: `rev-${uuidv4().slice(0, 8)}`,
      name: data.name.trim(),
      role: data.role.trim() || 'Verified Gourmet Critic',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80',
      dish: data.dish.trim(),
      quote: data.quote.trim(),
      rating: Math.max(1, Math.min(5, Math.round(data.rating))),
      isCritic: false,
      createdAt: new Date().toISOString(),
    }

    inMemoryDb.reviews.unshift(newReview)
    return newReview
  }
}

export const reviewService = new ReviewService()
