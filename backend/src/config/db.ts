import pg from 'pg'
import bcrypt from 'bcryptjs'
import { ENV } from './env.js'
import type { FoodItem, CustomizerOption, PromoCode, Review, User, Order } from '../domain/types.js'

const { Pool } = pg

// In-Memory Fallback State (Active when PostgreSQL container is not connected)
export interface InMemoryDatabase {
  users: Map<string, User>
  categories: Array<{ id: string; label: string; displayOrder: number; isActive: boolean }>
  foodItems: Map<string, FoodItem>
  customizerOptions: Map<string, CustomizerOption>
  promoCodes: Map<string, PromoCode>
  orders: Map<string, Order>
  reviews: Review[]
  subscribers: Set<string>
}

export const inMemoryDb: InMemoryDatabase = {
  users: new Map(),
  categories: [
    { id: 'all', label: 'All Dishes', displayOrder: 0, isActive: true },
    { id: 'burgers', label: 'Artisan Burgers', displayOrder: 1, isActive: true },
    { id: 'pizza', label: 'Wood-Fired Pizza', displayOrder: 2, isActive: true },
    { id: 'ramen', label: 'Kyoto Ramen', displayOrder: 3, isActive: true },
    { id: 'sushi', label: 'Imperial Sushi', displayOrder: 4, isActive: true },
    { id: 'desserts', label: 'Sweet Finishes', displayOrder: 5, isActive: true },
  ],
  foodItems: new Map(),
  customizerOptions: new Map(),
  promoCodes: new Map(),
  orders: new Map(),
  reviews: [],
  subscribers: new Set(),
}

export let pool: pg.Pool | null = null
export let isPostgresConnected = false

export async function initDatabase(): Promise<void> {
  // Always seed in-memory DB first so instant fallback is guaranteed
  await seedInitialData()

  try {
    const testPool = new Pool({
      connectionString: ENV.DATABASE_URL,
      host: ENV.PG_HOST,
      port: ENV.PG_PORT,
      user: ENV.PG_USER,
      password: ENV.PG_PASSWORD,
      database: ENV.PG_DATABASE,
      connectionTimeoutMillis: 2500,
    })

    const client = await testPool.connect()
    console.log('✅ [Database] PostgreSQL connected successfully at', `${ENV.PG_HOST}:${ENV.PG_PORT}/${ENV.PG_DATABASE}`)
    client.release()
    pool = testPool
    isPostgresConnected = true
    await runPostgresMigrations()
  } catch (err: any) {
    console.warn('⚠️ [Database] PostgreSQL offline or unreachable. Seamlessly activating high-performance In-Memory repository adapter.')
    isPostgresConnected = false
    pool = null
  }
}

async function runPostgresMigrations() {
  if (!pool) return
  const migrationSql = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100) NOT NULL,
      phone VARCHAR(30),
      role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_items (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      tagline VARCHAR(255) NOT NULL,
      category_id VARCHAR(50) NOT NULL,
      price NUMERIC(8, 2) NOT NULL,
      rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
      reviews_count INT NOT NULL DEFAULT 0,
      prep_time VARCHAR(50) NOT NULL,
      calories INT NOT NULL,
      spicy_level INT NOT NULL DEFAULT 0,
      is_chef_special BOOLEAN NOT NULL DEFAULT false,
      is_popular BOOLEAN NOT NULL DEFAULT false,
      description TEXT NOT NULL,
      ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
      image VARCHAR(500) NOT NULL,
      model_type VARCHAR(50) NOT NULL,
      is_available BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS customizer_options (
      id VARCHAR(100) PRIMARY KEY,
      option_type VARCHAR(50) NOT NULL,
      name VARCHAR(100) NOT NULL,
      additional_price NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
      calories INT NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      code VARCHAR(50) PRIMARY KEY,
      discount_amount NUMERIC(6, 2) NOT NULL DEFAULT 5.00,
      discount_type VARCHAR(20) NOT NULL DEFAULT 'FIXED',
      min_order_subtotal NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
      max_uses INT DEFAULT 10000,
      current_uses INT DEFAULT 0,
      expires_at TIMESTAMP WITH TIME ZONE,
      is_active BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(100) PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      user_id VARCHAR(100),
      customer_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      delivery_type VARCHAR(30) NOT NULL,
      delivery_address TEXT NOT NULL,
      subtotal NUMERIC(8, 2) NOT NULL,
      delivery_fee NUMERIC(6, 2) NOT NULL,
      discount_amount NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
      total_amount NUMERIC(8, 2) NOT NULL,
      promo_code VARCHAR(50),
      status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
      drone_id VARCHAR(50) DEFAULT 'POD-DRONE-X9',
      eta_minutes INT DEFAULT 14,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(100) NOT NULL,
      avatar VARCHAR(500) NOT NULL,
      dish VARCHAR(150) NOT NULL,
      quote TEXT NOT NULL,
      rating INT NOT NULL DEFAULT 5,
      is_critic BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id VARCHAR(100) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      tier VARCHAR(50) DEFAULT 'VIP_CHEF_LIST',
      subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
  await pool.query(migrationSql)
  console.log('✅ [Database] PostgreSQL schema verified/migrated.')
}

async function seedInitialData() {
  // 1. Initial Users
  const customerPassword = await bcrypt.hash('GourmetGuest123!', 10)
  const adminPassword = await bcrypt.hash('ChefNayeem2026!', 10)
  const chefPassword = await bcrypt.hash('KitchenStation04!', 10)
  const dispatcherPassword = await bcrypt.hash('DroneRadar2026!', 10)

  const defaultUsers: User[] = [
    {
      id: 'usr-customer-01',
      email: 'customer@nayeemspices.com',
      passwordHash: customerPassword,
      fullName: 'Gourmet Patron',
      phone: '+1 (555) 019-8234',
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr-admin-01',
      email: 'admin@nayeemspices.com',
      passwordHash: adminPassword,
      fullName: 'Chef Nayeem (Executive)',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr-chef-01',
      email: 'chef@nayeemspices.com',
      passwordHash: chefPassword,
      fullName: 'Station 04 Plating Chef',
      role: 'CHEF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr-dispatcher-01',
      email: 'dispatcher@nayeemspices.com',
      passwordHash: dispatcherPassword,
      fullName: 'Autonomous Fleet Radar Control',
      role: 'DISPATCHER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
  defaultUsers.forEach((u) => inMemoryDb.users.set(u.email, u))

  // 2. Food Items
  const items: FoodItem[] = [
    {
      id: 'cyber-wagyu-burger',
      name: 'Neo Wagyu Truffle Burger',
      tagline: 'Double A5 Wagyu patty with black truffle emulsion',
      categoryId: 'burgers',
      price: 18.99,
      rating: 4.95,
      reviewsCount: 1420,
      prepTime: '12-15 min',
      calories: 780,
      spicyLevel: 1,
      isChefSpecial: true,
      isPopular: true,
      description:
        'Charred double A5 Wagyu beef smashed with caramelized shallots, 24-month aged gouda, black winter truffle aioli, and crisp hydro lettuce encased in a gilded brioche bun.',
      ingredients: [
        'Gilded Sesame Brioche',
        'Double A5 Wagyu Beef',
        'Aged Melting Gouda',
        'Black Truffle Aioli',
        'Crispy Butterhead Lettuce',
        'Caramelized Balsamic Shallots',
      ],
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      modelType: 'burger',
      isAvailable: true,
    },
    {
      id: 'artisan-truffle-pizza',
      name: 'Smoked Prosciutto & Truffle Pizza',
      tagline: 'Wood-fired 72-hour sourdough with fior di latte',
      categoryId: 'pizza',
      price: 21.5,
      rating: 4.92,
      reviewsCount: 980,
      prepTime: '15-18 min',
      calories: 890,
      spicyLevel: 0,
      isChefSpecial: true,
      isPopular: true,
      description:
        '72-hour fermented sourdough crust kissed by 500°C fire. Topped with creamy fior di latte, aged San Daniele prosciutto, wild chanterelles, and aromatic white truffle oil.',
      ingredients: [
        '72h Sourdough Crust',
        'San Marzano Tomato Reduction',
        'Fior di Latte Mozzarella',
        'Smoked San Daniele Prosciutto',
        'White Truffle Emulsion',
        'Organic Fresh Sweet Basil',
      ],
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      modelType: 'pizza',
      isAvailable: true,
    },
    {
      id: 'neon-tonkotsu-ramen',
      name: 'Kyoto Black Garlic Tonkotsu',
      tagline: 'Rich 24h pork marrow broth with charred chashu',
      categoryId: 'ramen',
      price: 16.5,
      rating: 4.98,
      reviewsCount: 2140,
      prepTime: '10-12 min',
      calories: 690,
      spicyLevel: 2,
      isChefSpecial: true,
      isPopular: true,
      description:
        'Silky 24-hour simmered pork bone broth layered with charred black garlic mayu, tender braised Berkshire pork belly, nitamago lava egg, and hand-pulled springy noodles.',
      ingredients: [
        '24h Simmered Tonkotsu Broth',
        'Handcrafted Alkaline Noodles',
        'Braised Berkshire Chashu',
        'Soft-Boiled Nitamago Lava Egg',
        'Charred Black Garlic Oil',
        'Toasted Nori & Menma Bamboo',
      ],
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
      modelType: 'ramen',
      isAvailable: true,
    },
    {
      id: 'tokyo-dragon-sushi',
      name: 'Imperial Dragon Sushi Roll',
      tagline: 'Torched salmon belly, glazed unagi, and gold leaf',
      categoryId: 'sushi',
      price: 24.0,
      rating: 4.94,
      reviewsCount: 860,
      prepTime: '12-14 min',
      calories: 520,
      spicyLevel: 1,
      isChefSpecial: false,
      isPopular: true,
      description:
        'Crispy tiger prawn tempura and creamy Hass avocado wrapped in seasoned Niigata rice, topped with torched King salmon belly, BBQ freshwater unagi, and edible 24K gold foil.',
      ingredients: [
        'Niigata Koshihikari Rice',
        'Torched King Salmon Belly',
        'Freshwater Glazed Unagi',
        'Crispy Tiger Prawn Tempura',
        'Hass Avocado Cream',
        'Tobiko Flying Fish Roe',
      ],
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
      modelType: 'sushi',
      isAvailable: true,
    },
    {
      id: 'spicy-korean-crispy-burger',
      name: 'Gochujang Glazed Crispy Chicken',
      tagline: 'Triple-dredged chicken thigh with spicy sesame glaze',
      categoryId: 'burgers',
      price: 15.99,
      rating: 4.88,
      reviewsCount: 740,
      prepTime: '10-12 min',
      calories: 720,
      spicyLevel: 3,
      isPopular: false,
      description:
        'Ultra-crisp double-fried buttermilk chicken thigh drenched in sweet & spicy gochujang chili glaze, stacked with tangy pickled daikon slaw and roasted garlic kewpie.',
      ingredients: [
        'Toasted Potato Bun',
        'Double-Fried Chicken Thigh',
        'Sweet Gochujang Glaze',
        'Pickled Daikon Radish',
        'Roasted Garlic Kewpie',
        'Toasted White Sesame',
      ],
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80',
      modelType: 'burger',
      isAvailable: true,
    },
    {
      id: 'quattro-formaggi-pizza',
      name: 'Quattro Formaggi & Hot Honey',
      tagline: 'Gorgonzola dolce, fontina, smoked scamorza & spicy honey',
      categoryId: 'pizza',
      price: 19.5,
      rating: 4.89,
      reviewsCount: 650,
      prepTime: '14-16 min',
      calories: 840,
      spicyLevel: 1,
      isPopular: false,
      description:
        'White base pizza featuring melted gorgonzola dolce, Alpine fontina, creamy taleggio, and smoked scamorza, finished with a generous swirl of habanero infused wildflower hot honey.',
      ingredients: [
        'Sourdough Pizza Crust',
        'Gorgonzola Dolce DOP',
        'Alpine Fontina & Taleggio',
        'Smoked Scamorza',
        'Habanero Hot Honey',
        'Crisp Thyme Leaves',
      ],
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      modelType: 'pizza',
      isAvailable: true,
    },
    {
      id: 'spicy-tantanmen-ramen',
      name: 'Spicy Sesame Tantanmen Ramen',
      tagline: 'Sichuan chili broth with seasoned minced pork and pak choi',
      categoryId: 'ramen',
      price: 17.0,
      rating: 4.91,
      reviewsCount: 1120,
      prepTime: '12-14 min',
      calories: 740,
      spicyLevel: 3,
      isPopular: true,
      description:
        'A fiery and aromatic broth made from roasted sesame paste and Sichuan chili oil, loaded with stir-fried spiced pork crumble, crunchy baby pak choi, and roasted crushed peanuts.',
      ingredients: [
        'Roasted Sesame Chili Broth',
        'Wavy Hand-Pulled Noodles',
        'Sichuan Spiced Pork Crumble',
        'Crisp Baby Pak Choi',
        'Crushed Roasted Peanuts',
        'Chili Threads & Scallions',
      ],
      image: 'https://images.unsplash.com/photo-1614597394030-221008d669e2?auto=format&fit=crop&w=800&q=80',
      modelType: 'ramen',
      isAvailable: true,
    },
    {
      id: 'matcha-lava-cake',
      name: 'Kyoto Uji Matcha Molten Cake',
      tagline: 'Warm ceremonial matcha ganache with black sesame gelato',
      categoryId: 'desserts',
      price: 11.5,
      rating: 4.97,
      reviewsCount: 890,
      prepTime: '8-10 min',
      calories: 460,
      spicyLevel: 0,
      isChefSpecial: true,
      isPopular: true,
      description:
        'Steaming dark chocolate cake with a molten center of pure ceremonial-grade Uji matcha ganache. Served with artisanal roasted black sesame gelato and candied yuzu zest.',
      ingredients: [
        'Valrhona Dark Chocolate',
        'Uji Ceremonial Matcha Ganache',
        'Black Sesame Gelato',
        'Candied Yuzu Zest',
        'Gold Dust Garnish',
      ],
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
      modelType: 'burger',
      isAvailable: true,
    },
  ]
  items.forEach((item) => inMemoryDb.foodItems.set(item.id, item))

  // 3. Customizer Options
  const customOptions: CustomizerOption[] = [
    { id: 'top-1', optionType: 'topping', name: 'Crispy Smoked Pancetta', additionalPrice: 2.8, calories: 120, isActive: true },
    { id: 'top-2', optionType: 'topping', name: 'Pickled Habanero Jalapeños', additionalPrice: 1.2, calories: 15, isActive: true },
    { id: 'top-3', optionType: 'topping', name: 'Black Truffle Aioli', additionalPrice: 1.5, calories: 90, isActive: true },
    { id: 'top-4', optionType: 'topping', name: 'Caramelized Balsamic Shallots', additionalPrice: 1.5, calories: 45, isActive: true },
    { id: 'top-5', optionType: 'topping', name: 'Organic Fried Duck Egg', additionalPrice: 2.2, calories: 110, isActive: true },
    { id: 'top-6', optionType: 'modal_extra', name: 'Double Aged Truffle Gouda', additionalPrice: 2.5, calories: 130, isActive: true },
    { id: 'top-7', optionType: 'modal_extra', name: 'Extra Umami Aioli Dip', additionalPrice: 1.8, calories: 80, isActive: true },
  ]
  customOptions.forEach((opt) => inMemoryDb.customizerOptions.set(opt.name, opt))

  // 4. Promo Codes
  const promos: PromoCode[] = [
    { code: 'NAYEEM', discountAmount: 5.0, discountType: 'FIXED', minOrderSubtotal: 0, maxUses: 10000, currentUses: 0, isActive: true },
    { code: 'TASTE', discountAmount: 5.0, discountType: 'FIXED', minOrderSubtotal: 0, maxUses: 10000, currentUses: 0, isActive: true },
    { code: 'CRAVE3D', discountAmount: 5.0, discountType: 'FIXED', minOrderSubtotal: 0, maxUses: 10000, currentUses: 0, isActive: true },
    { code: 'CHEF', discountAmount: 5.0, discountType: 'FIXED', minOrderSubtotal: 0, maxUses: 10000, currentUses: 0, isActive: true },
  ]
  promos.forEach((p) => inMemoryDb.promoCodes.set(p.code, p))

  // 5. Critic Reviews
  inMemoryDb.reviews = [
    {
      id: 'rev-01',
      name: 'Chef Anthony Laurent',
      role: 'Michelin Guide Reviewer',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=160&h=160&q=80',
      dish: 'Neo Wagyu Truffle Burger',
      quote:
        'I was skeptical about drone delivery until I opened the pod. The Wagyu brioche was still warm with pristine steam rising, and the truffle gouda was perfectly molten.',
      rating: 5,
      isCritic: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rev-02',
      name: 'Maya Lin',
      role: 'Culinary Journalist & Tech Critic',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      dish: 'Kyoto Black Garlic Tonkotsu',
      quote:
        'The hand-pulled noodles retained their perfect al dente spring, and the nitamago egg yolk oozed like it came directly from the kitchen counter 30 seconds ago.',
      rating: 5,
      isCritic: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rev-03',
      name: 'Jonathan Vance',
      role: 'Executive Architect, FinTech HQ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      dish: 'Smoked Prosciutto Pizza',
      quote:
        'Being able to inspect each pizza topping in 3D before ordering is addictive. The crust arrived blistering hot on our high-rise balcony pad in just 14 minutes.',
      rating: 5,
      isCritic: true,
      createdAt: new Date().toISOString(),
    },
  ]
}
