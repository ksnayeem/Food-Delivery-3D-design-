import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'
import { UnauthorizedError, ForbiddenError } from './errorHandler.js'
import { inMemoryDb, pool } from '../config/db.js'
import type { UserRole, User } from '../domain/types.js'

export interface AuthenticatedUser {
  id: string
  email: string
  fullName: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

export function generateToken(user: { id: string; email: string; fullName: string; role: UserRole }): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    ENV.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or malformed Authorization header. Expected Bearer token.')
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser
    req.user = decoded
    next()
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Authentication token has expired. Please login again.')
    }
    throw new UnauthorizedError('Invalid authentication token.')
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser
      req.user = decoded
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next()
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required')
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Requires one of: ${allowedRoles.join(', ')}`)
    }
    next()
  }
}
