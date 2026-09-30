import { inMemoryDb } from '../config/db.js'
import { menuService } from './menuService.js'
import { ValidationError } from '../middleware/errorHandler.js'
import { ALLOWED_CHEESES } from '../domain/validation.js'
import type { CustomizerOption } from '../domain/types.js'

export class CustomizerService {
  async getOptions(): Promise<{
    cheeses: string[]
    pattyTiers: Array<{ count: number; label: string; extraPrice: number; extraCalories: number }>
    toppings: CustomizerOption[]
  }> {
    const toppings = Array.from(inMemoryDb.customizerOptions.values())

    return {
      cheeses: [...ALLOWED_CHEESES],
      pattyTiers: [
        { count: 1, label: 'Single (180g)', extraPrice: 0.0, extraCalories: 0 },
        { count: 2, label: 'Double (360g)', extraPrice: 4.5, extraCalories: 240 },
        { count: 3, label: 'Triple Monster', extraPrice: 9.0, extraCalories: 480 },
      ],
      toppings,
    }
  }

  async calculateCustomBurger(params: {
    baseFoodId: string
    pattyCount: 1 | 2 | 3
    cheeseType: string
    selectedToppings: string[]
  }) {
    const baseFood = await menuService.getItemById(params.baseFoodId)
    if (!baseFood) {
      throw new ValidationError(`Base burger item '${params.baseFoodId}' does not exist.`)
    }

    if (!ALLOWED_CHEESES.includes(params.cheeseType as any)) {
      throw new ValidationError(`Invalid cheese selection '${params.cheeseType}'.`)
    }

    // 1. Calculate extra patty price: (pattyCount - 1) * 4.50
    const extraPattyPrice = (params.pattyCount - 1) * 4.5
    const extraPattyCalories = (params.pattyCount - 1) * 240

    // 2. Validate and sum toppings
    let toppingsPrice = 0
    let toppingsCalories = 0
    const validatedToppings: string[] = []

    for (const toppingName of params.selectedToppings) {
      const option = inMemoryDb.customizerOptions.get(toppingName)
      if (option) {
        toppingsPrice += option.additionalPrice
        toppingsCalories += option.calories
        validatedToppings.push(option.name)
      } else {
        // Modal general toppings fallback
        toppingsPrice += 2.2
        toppingsCalories += 70
        validatedToppings.push(toppingName)
      }
    }

    const totalPrice = parseFloat((baseFood.price + extraPattyPrice + toppingsPrice).toFixed(2))
    const totalCalories = baseFood.calories + extraPattyCalories + toppingsCalories

    return {
      baseFoodId: baseFood.id,
      baseName: baseFood.name,
      basePrice: baseFood.price,
      pattyCount: params.pattyCount,
      extraPattyPrice,
      cheeseType: params.cheeseType,
      selectedToppings: validatedToppings,
      toppingsPrice: parseFloat(toppingsPrice.toFixed(2)),
      totalPrice,
      totalCalories,
      formattedSummary: `${params.pattyCount}x Wagyu Patty, ${params.cheeseType} + ${validatedToppings.join(', ') || 'No extras'}`,
    }
  }
}

export const customizerService = new CustomizerService()
