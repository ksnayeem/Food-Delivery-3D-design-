import { inMemoryDb, pool, isPostgresConnected } from '../config/db.js'
import { cache } from '../config/redis.js'
import { NotFoundError } from '../middleware/errorHandler.js'
import type { FoodItem } from '../domain/types.js'

export class MenuService {
  async getCategories() {
    return inMemoryDb.categories
  }

  async getMenu(category?: string, search?: string): Promise<FoodItem[]> {
    const cacheKey = `menu:cat_${category || 'all'}:q_${search || 'none'}`
    const cached = await cache.get(cacheKey)
    if (cached) {
      try {
        return JSON.parse(cached)
      } catch {
        // continue
      }
    }

    let items: FoodItem[] = []

    if (isPostgresConnected && pool) {
      let query = 'SELECT * FROM food_items WHERE is_available = true'
      const params: any[] = []

      if (category && category !== 'all') {
        params.push(category)
        query += ` AND category_id = $${params.length}`
      }

      if (search && search.trim()) {
        params.push(`%${search.trim().toLowerCase()}%`)
        query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`
      }

      const res = await pool.query(query, params)
      items = res.rows.map((r) => ({
        id: r.id,
        name: r.name,
        tagline: r.tagline,
        categoryId: r.category_id,
        price: parseFloat(r.price),
        rating: parseFloat(r.rating),
        reviewsCount: r.reviews_count,
        prepTime: r.prep_time,
        calories: r.calories,
        spicyLevel: r.spicy_level,
        isChefSpecial: r.is_chef_special,
        isPopular: r.is_popular,
        description: r.description,
        ingredients: typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients,
        image: r.image,
        modelType: r.model_type,
        isAvailable: r.is_available,
      }))
    } else {
      items = Array.from(inMemoryDb.foodItems.values()).filter((item) => {
        const matchesCategory = !category || category === 'all' || item.categoryId === category
        const matchesSearch =
          !search ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(search.toLowerCase()))
        return matchesCategory && matchesSearch && (item.isAvailable !== false)
      })
    }

    // Cache menu query for 60 seconds
    await cache.set(cacheKey, JSON.stringify(items), 60)
    return items
  }

  async getItemById(id: string): Promise<FoodItem> {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM food_items WHERE id = $1', [id])
      if (res.rows.length > 0) {
        const r = res.rows[0]
        return {
          id: r.id,
          name: r.name,
          tagline: r.tagline,
          categoryId: r.category_id,
          price: parseFloat(r.price),
          rating: parseFloat(r.rating),
          reviewsCount: r.reviews_count,
          prepTime: r.prep_time,
          calories: r.calories,
          spicyLevel: r.spicy_level,
          isChefSpecial: r.is_chef_special,
          isPopular: r.is_popular,
          description: r.description,
          ingredients: typeof r.ingredients === 'string' ? JSON.parse(r.ingredients) : r.ingredients,
          image: r.image,
          modelType: r.model_type,
          isAvailable: r.is_available,
        }
      }
    }

    const item = inMemoryDb.foodItems.get(id)
    if (!item) {
      throw new NotFoundError(`Food item with ID '${id}' not found.`)
    }
    return item
  }
}

export const menuService = new MenuService()
