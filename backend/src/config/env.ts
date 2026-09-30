import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'nayeem_spices_ultra_secure_jwt_secret_key_2026_!@#$%^',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'nayeem_spices_refresh_secret_key_2026_&*()',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // PostgreSQL
  DATABASE_URL: process.env.DATABASE_URL,
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: parseInt(process.env.PG_PORT || '5432', 10),
  PG_USER: process.env.PG_USER || 'nayeem_admin',
  PG_PASSWORD: process.env.PG_PASSWORD || 'nayeem_spices_password',
  PG_DATABASE: process.env.PG_DATABASE || 'nayeem_spices_db',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),

  // Kafka
  KAFKA_BROKERS: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || 'nayeem-spices-backend',
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || 'nayeem-spices-consumer-group',
}
