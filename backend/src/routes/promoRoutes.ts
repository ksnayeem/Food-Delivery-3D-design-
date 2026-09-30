import { Router } from 'express'
import { promoController } from '../controllers/promoController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.post('/validate', asyncHandler((req, res) => promoController.validate(req, res)))

export default router
