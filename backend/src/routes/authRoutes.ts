import { Router } from 'express'
import { authController } from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.post('/register', asyncHandler((req, res) => authController.register(req, res)))
router.post('/login', asyncHandler((req, res) => authController.login(req, res)))
router.get('/me', authenticate, asyncHandler((req, res) => authController.me(req, res)))

export default router
