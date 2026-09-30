import { Router } from 'express'
import { reviewController } from '../controllers/reviewController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.get('/', asyncHandler((req, res) => reviewController.getReviews(req, res)))
router.post('/', asyncHandler((req, res) => reviewController.addReview(req, res)))

export default router
