import { Router } from 'express'
import authRoutes from './authRoutes.js'
import menuRoutes from './menuRoutes.js'
import customizerRoutes from './customizerRoutes.js'
import promoRoutes from './promoRoutes.js'
import orderRoutes from './orderRoutes.js'
import telemetryRoutes from './telemetryRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import newsletterRoutes from './newsletterRoutes.js'
import { isPostgresConnected } from '../config/db.js'
import { isRedisConnected } from '../config/redis.js'
import { isKafkaConnected } from '../config/kafka.js'

const apiRouter = Router()

// Health & System Status Endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Nayeem Spices 3D Food Delivery API Gateway',
    infrastructure: {
      postgres: isPostgresConnected ? 'CONNECTED' : 'IN_MEMORY_FALLBACK_ACTIVE',
      redis: isRedisConnected ? 'CONNECTED' : 'IN_MEMORY_CACHE_ACTIVE',
      kafka: isKafkaConnected ? 'CONNECTED' : 'IN_MEMORY_EVENT_BUS_ACTIVE',
    },
  })
})

apiRouter.use('/auth', authRoutes)
apiRouter.use('/menu', menuRoutes)
apiRouter.use('/customizer', customizerRoutes)
apiRouter.use('/promos', promoRoutes)
apiRouter.use('/orders', orderRoutes)
apiRouter.use('/telemetry', telemetryRoutes)
apiRouter.use('/reviews', reviewRoutes)
apiRouter.use('/newsletter', newsletterRoutes)

export default apiRouter
