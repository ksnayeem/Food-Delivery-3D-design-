import { Router } from 'express'
import { newsletterController } from '../controllers/newsletterController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.post('/subscribe', asyncHandler((req, res) => newsletterController.subscribe(req, res)))

export default router
