import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { inMemoryDb, pool, isPostgresConnected } from '../config/db.js'
import { generateToken } from '../middleware/auth.js'
import { ConflictError, UnauthorizedError, NotFoundError } from '../middleware/errorHandler.js'
import type { User, UserRole } from '../domain/types.js'

export class AuthService {
  async register(data: { email: string; password: string; fullName: string; phone?: string }) {
    const normalizedEmail = data.email.trim().toLowerCase()

    // Check existing
    if (isPostgresConnected && pool) {
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail])
      if (existing.rows.length > 0) {
        throw new ConflictError('A user with this email address already exists.')
      }
    } else {
      if (inMemoryDb.users.has(normalizedEmail)) {
        throw new ConflictError('A user with this email address already exists.')
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10)
    const id = `usr-${uuidv4().slice(0, 8)}`
    const now = new Date().toISOString()

    const newUser: User = {
      id,
      email: normalizedEmail,
      passwordHash,
      fullName: data.fullName.trim(),
      phone: data.phone?.trim(),
      role: 'CUSTOMER',
      createdAt: now,
      updatedAt: now,
    }

    if (isPostgresConnected && pool) {
      await pool.query(
        'INSERT INTO users (id, email, password_hash, full_name, phone, role) VALUES ($1, $2, $3, $4, $5, $6)',
        [newUser.id, newUser.email, newUser.passwordHash, newUser.fullName, newUser.phone, newUser.role]
      )
    }
    inMemoryDb.users.set(normalizedEmail, newUser)

    const token = generateToken(newUser)
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone,
      },
    }
  }

  async login(data: { email: string; password: string }) {
    const normalizedEmail = data.email.trim().toLowerCase()
    let user: User | undefined

    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail])
      if (res.rows.length > 0) {
        const row = res.rows[0]
        user = {
          id: row.id,
          email: row.email,
          passwordHash: row.password_hash,
          fullName: row.full_name,
          phone: row.phone,
          role: row.role as UserRole,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }
      }
    } else {
      user = inMemoryDb.users.get(normalizedEmail)
    }

    if (!user) {
      throw new UnauthorizedError('Invalid email or password.')
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash)
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password.')
    }

    const token = generateToken(user)
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
      },
    }
  }

  async getProfile(userId: string) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = $1', [userId])
      if (res.rows.length > 0) {
        const r = res.rows[0]
        return {
          id: r.id,
          email: r.email,
          fullName: r.full_name,
          phone: r.phone,
          role: r.role,
          createdAt: r.created_at,
        }
      }
    }

    for (const u of inMemoryDb.users.values()) {
      if (u.id === userId) {
        return {
          id: u.id,
          email: u.email,
          fullName: u.fullName,
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt,
        }
      }
    }

    throw new NotFoundError('User profile not found.')
  }
}

export const authService = new AuthService()
