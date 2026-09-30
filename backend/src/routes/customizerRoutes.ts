import { Router } from 'express'
import { customizerController } from '../controllers/customizerController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.get('/options', asyncHandler((req, res) => customizerController.getOptions(req, res)))
router.post('/calculate', asyncHandler((req, res) => customizerController.calculate(req, res)))

export default router
