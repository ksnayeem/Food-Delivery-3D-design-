import { inMemoryDb } from '../config/db.js'
import { ValidationError } from '../middleware/errorHandler.js'

export class PromoService {
  async validatePromo(code: string, subtotal: number) {
    const normalized = code.trim().toUpperCase()
    const promo = inMemoryDb.promoCodes.get(normalized)

    if (!promo || !promo.isActive) {
      throw new ValidationError(`Promo code '${code}' is invalid or has expired. Try code 'NAYEEM'.`)
    }

    if (promo.minOrderSubtotal > 0 && subtotal < promo.minOrderSubtotal) {
      throw new ValidationError(
        `Promo code '${code}' requires a minimum subtotal of $${promo.minOrderSubtotal.toFixed(2)}.`
      )
    }

    const discountAmount = promo.discountType === 'FIXED' ? promo.discountAmount : (subtotal * promo.discountAmount) / 100
    const finalDiscount = Math.min(discountAmount, subtotal)

    return {
      isValid: true,
      code: promo.code,
      discountAmount: parseFloat(finalDiscount.toFixed(2)),
      message: `$${finalDiscount.toFixed(2)} VIP discount applied successfully!`,
    }
  }
}

export const promoService = new PromoService()
