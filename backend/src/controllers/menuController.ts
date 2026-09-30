import type { Request, Response } from 'express'
import { menuService } from '../services/menuService.js'

export class MenuController {
  async getMenu(req: Request, res: Response) {
    const category = req.query.category as string | undefined
    const search = req.query.search as string | undefined
    const items = await menuService.getMenu(category, search)
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    })
  }

  async getCategories(req: Request, res: Response) {
    const categories = await menuService.getCategories()
    res.status(200).json({
      success: true,
      data: categories,
    })
  }

  async getItemById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const item = await menuService.getItemById(id)
    res.status(200).json({
      success: true,
      data: item,
    })
  }
}

export const menuController = new MenuController()
