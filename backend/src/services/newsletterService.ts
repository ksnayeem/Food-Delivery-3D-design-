import { inMemoryDb } from '../config/db.js'
import { ConflictError } from '../middleware/errorHandler.js'

export class NewsletterService {
  async subscribe(email: string) {
    const normalized = email.trim().toLowerCase()
    if (inMemoryDb.subscribers.has(normalized)) {
      throw new ConflictError("You're already enrolled on the VIP Chef List!")
    }

    inMemoryDb.subscribers.add(normalized)
    return {
      success: true,
      email: normalized,
      tier: 'VIP_CHEF_LIST',
      message: "Welcome to the VIP Chef List! You'll receive secret omakase drop alerts.",
    }
  }
}

export const newsletterService = new NewsletterService()
