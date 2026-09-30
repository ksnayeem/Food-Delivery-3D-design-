import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
})

export const ALLOWED_CHEESES = [
  'Melting Aged Gouda',
  'Smoked Cheddar',
  'Truffle Havarti',
  'Pepper Jack',
] as const

export const ALLOWED_TOPPINGS = [
  'Crispy Smoked Pancetta',
  'Pickled Habanero Jalapeños',
  'Black Truffle Aioli',
  'Caramelized Balsamic Shallots',
  'Organic Fried Duck Egg',
  'Double Aged Truffle Gouda',
  'Extra Umami Aioli Dip',
] as const

export const CustomizerCalculateSchema = z.object({
  baseFoodId: z.string().min(1, 'Base food item ID is required'),
  pattyCount: z.union([z.literal(1), z.literal(2), z.literal(3)], {
    errorMap: () => ({ message: 'Patty count must be 1, 2, or 3' }),
  }),
  cheeseType: z.string().refine((val) => ALLOWED_CHEESES.includes(val as any), {
    message: `Invalid cheese selection. Allowed: ${ALLOWED_CHEESES.join(', ')}`,
  }),
  selectedToppings: z.array(z.string()).default([]),
})

export const PromoValidateSchema = z.object({
  code: z.string().min(1, 'Promo code cannot be empty'),
  subtotal: z.number().nonnegative('Subtotal must be non-negative'),
})

export const OrderItemInputSchema = z.object({
  foodId: z.string().min(1, 'Food item ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Quantity cannot exceed 99'),
  pattyCount: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  cheeseType: z.string().optional(),
  selectedToppings: z.array(z.string()).optional().default([]),
  specialInstructions: z.string().max(255).optional(),
})

export const CreateOrderSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerEmail: z.string().email('Valid customer email is required'),
  deliveryType: z.enum(['drone', 'courier'], {
    errorMap: () => ({ message: "Delivery type must be 'drone' or 'courier'" }),
  }),
  deliveryAddress: z.string().min(5, 'Delivery address must be specified'),
  promoCode: z.string().optional(),
  items: z.array(OrderItemInputSchema).min(1, 'Order must contain at least one item'),
})

export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING_PAYMENT',
    'CONFIRMED',
    'KITCHEN_PREPARING',
    'PLATED',
    'HERMETICALLY_SEALED',
    'AIRBORNE',
    'DESCENDING',
    'DELIVERED',
    'CANCELLED',
  ]),
})

export const NewsletterSubscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
})

export const ReviewCreateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().default('Food Enthusiast'),
  dish: z.string().min(2, 'Dish name is required'),
  quote: z.string().min(5, 'Review quote must be at least 5 characters'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
})
