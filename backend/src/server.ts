import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { ENV } from './config/env.js'
import { initDatabase } from './config/db.js'
import { initRedis } from './config/redis.js'
import { initKafka } from './config/kafka.js'
import apiRouter from './routes/index.js'
import { errorHandler, NotFoundError } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import { droneTelemetryService } from './services/droneTelemetryService.js'

const app = express()

// 1. Security & Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // allow Three.js assets and client embeds
    crossOriginEmbedderPolicy: false,
  })
)

// 2. CORS configuration
app.use(
  cors({
    origin: [ENV.CLIENT_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
)

// 3. Request Parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 4. Rate Limiter (120 req / minute per IP)
app.use(rateLimiter(150, 60))

// 5. Mount API Routes
app.use('/api/v1', apiRouter)
app.use('/api', apiRouter) // alias for backwards compatibility

// 6. 404 Handler
app.use((req, res, next) => {
  next(new NotFoundError(`Endpoint ${req.method} ${req.originalUrl} does not exist.`))
})

// 7. Centralized Error Handler
app.use(errorHandler)

// Server Startup
async function startServer() {
  console.log('🚀 [Nayeem Spices] Initializing Autonomous 3D Food Delivery Backend...')

  // Initialize DB, Redis, Kafka
  await initDatabase()
  await initRedis()
  await initKafka()

  const server = app.listen(ENV.PORT, () => {
    console.log(`✨ [Server] HTTP API Gateway listening on http://localhost:${ENV.PORT}`)
    console.log(`📡 [Telemetry] Live Drone Radar SSE stream available at http://localhost:${ENV.PORT}/api/v1/telemetry/live`)
    console.log(`🍔 [Catalog] Menu catalog available at http://localhost:${ENV.PORT}/api/v1/menu`)
  })

  // Graceful Shutdown
  const shutdown = () => {
    console.log('\n🛑 [Server] Gracefully shutting down...')
    droneTelemetryService.destroy()
    server.close(() => {
      console.log('🏁 [Server] All connections closed. Goodbye!')
      process.exit(0)
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

startServer().catch((err) => {
  console.error('❌ [Server Startup Failure]', err)
  process.exit(1)
})

export default app
