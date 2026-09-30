import { Redis } from 'ioredis'
import { EventEmitter } from 'events'
import { ENV } from './env.js'

export let redisClient: Redis | null = null
export let isRedisConnected = false

class InMemoryRedis extends EventEmitter {
  private store = new Map<string, { val: string; expiresAt?: number }>()

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key)
    if (!entry) return null
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.val
  }

  async set(key: string, val: string, mode?: string, duration?: number): Promise<'OK'> {
    let expiresAt: number | undefined
    if (mode === 'EX' && duration) {
      expiresAt = Date.now() + duration * 1000
    }
    this.store.set(key, { val, expiresAt })
    return 'OK'
  }

  async del(key: string): Promise<number> {
    const deleted = this.store.delete(key)
    return deleted ? 1 : 0
  }

  async publish(channel: string, message: string): Promise<number> {
    this.emit(channel, message)
    return 1
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    this.on(channel, callback)
  }
}

export const inMemoryRedis = new InMemoryRedis()

export async function initRedis(): Promise<void> {
  try {
    const client = new Redis(ENV.REDIS_URL, {
      connectTimeout: 2000,
      maxRetriesPerRequest: 1,
      retryStrategy: () => null, // don't hang if offline
    })

    client.on('connect', () => {
      console.log('✅ [Redis] Connected successfully to', ENV.REDIS_URL)
      redisClient = client
      isRedisConnected = true
    })

    client.on('error', () => {
      if (isRedisConnected) {
        console.warn('⚠️ [Redis] Connection dropped. Falling back to In-Memory Cache.')
      }
      isRedisConnected = false
      redisClient = null
    })

    // Wait briefly to see if connection succeeds
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        if (!isRedisConnected) {
          console.warn('⚠️ [Redis] Offline or unreachable. Using In-Memory Cache & Pub/Sub adapter.')
        }
        resolve()
      }, 500)

      client.once('ready', () => {
        clearTimeout(timeout)
        resolve()
      })
    })
  } catch {
    console.warn('⚠️ [Redis] Offline or unreachable. Using In-Memory Cache & Pub/Sub adapter.')
    isRedisConnected = false
    redisClient = null
  }
}

// Unified Cache Accessor
export const cache = {
  async get(key: string): Promise<string | null> {
    if (isRedisConnected && redisClient) {
      try {
        return await redisClient.get(key)
      } catch {
        return inMemoryRedis.get(key)
      }
    }
    return inMemoryRedis.get(key)
  },

  async set(key: string, val: string, ttlSeconds?: number): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        if (ttlSeconds) {
          await redisClient.set(key, val, 'EX', ttlSeconds)
        } else {
          await redisClient.set(key, val)
        }
        return
      } catch {
        // fallback
      }
    }
    await inMemoryRedis.set(key, val, ttlSeconds ? 'EX' : undefined, ttlSeconds)
  },

  async del(key: string): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.del(key)
        return
      } catch {
        // fallback
      }
    }
    await inMemoryRedis.del(key)
  },

  async publish(channel: string, message: string): Promise<void> {
    if (isRedisConnected && redisClient) {
      try {
        await redisClient.publish(channel, message)
        return
      } catch {
        // fallback
      }
    }
    await inMemoryRedis.publish(channel, message)
  },

  subscribe(channel: string, callback: (message: string) => void): void {
    inMemoryRedis.subscribe(channel, callback)
    if (isRedisConnected && redisClient) {
      const subClient = redisClient.duplicate()
      subClient.subscribe(channel)
      subClient.on('message', (ch: string, msg: string) => {
        if (ch === channel) callback(msg)
      })
    }
  },
}
