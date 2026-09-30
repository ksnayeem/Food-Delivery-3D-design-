import type { Request, Response, NextFunction } from 'express'
import { cache } from '../config/redis.js'
import { AppError } from './errorHandler.js'

export function rateLimiter(limit = 120, windowSec = 60) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const ip = req.ip || req.socket.remoteAddress || 'anonymous'
    const key = `ratelimit:${ip}`

    try {
      const current = await cache.get(key)
      const count = current ? parseInt(current, 10) : 0

      if (count >= limit) {
        res.setHeader('Retry-After', windowSec.toString())
        throw new AppError('Too many requests. Please slow down.', 429, 'RATE_LIMIT_EXCEEDED')
      }

      await cache.set(key, (count + 1).toString(), windowSec)
      res.setHeader('X-RateLimit-Limit', limit.toString())
      res.setHeader('X-RateLimit-Remaining', (limit - count - 1).toString())
      next()
    } catch (err: any) {
      if (err instanceof AppError) throw err
      // If cache fails, do not block traffic
      next()
    }
  }
}
