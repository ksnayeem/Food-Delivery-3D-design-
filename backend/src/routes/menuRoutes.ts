import { Router } from 'express'
import { menuController } from '../controllers/menuController.js'
import { asyncHandler } from '../middleware/errorHandler.js'

const router = Router()

router.get('/', asyncHandler((req, res) => menuController.getMenu(req, res)))
router.get('/categories', asyncHandler((req, res) => menuController.getCategories(req, res)))
router.get('/:id', asyncHandler((req, res) => menuController.getItemById(req, res)))
router.patch('/:id', asyncHandler((req, res) => menuController.updateItem(req, res)))

export default router
