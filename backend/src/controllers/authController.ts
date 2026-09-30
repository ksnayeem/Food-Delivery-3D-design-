import type { Request, Response } from 'express'
import { authService } from '../services/authService.js'
import { RegisterSchema, LoginSchema } from '../domain/validation.js'
import { UnauthorizedError } from '../middleware/errorHandler.js'

export class AuthController {
  async register(req: Request, res: Response) {
    const validated = RegisterSchema.parse(req.body)
    const result = await authService.register(validated)
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result,
    })
  }

  async login(req: Request, res: Response) {
    const validated = LoginSchema.parse(req.body)
    const result = await authService.login(validated)
    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    })
  }

  async me(req: Request, res: Response) {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated')
    }
    const profile = await authService.getProfile(req.user.id)
    res.status(200).json({
      success: true,
      data: profile,
    })
  }
}

export const authController = new AuthController()
