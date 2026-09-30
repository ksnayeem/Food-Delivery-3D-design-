import { Router } from 'express'
import { orderController } from '../controllers/orderController.js'
import { optionalAuth, authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.get('/', optionalAuth, asyncHandler((req, res) => orderController.getAllOrders(req, res)))
router.post('/', optionalAuth, asyncHandler((req, res) => orderController.createOrder(req, res)))
router.get('/:id', asyncHandler((req, res) => orderController.getOrderById(req, res)))
router.patch(
  '/:id/status',
  asyncHandler((req, res) => orderController.updateOrderStatus(req, res))
)

export default router
