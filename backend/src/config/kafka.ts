import { Kafka, Producer, Consumer, logLevel } from 'kafkajs'
import { EventEmitter } from 'events'
import { ENV } from './env.js'

export const TOPICS = {
  ORDER_EVENTS: 'orders.events',
  DRONE_TELEMETRY: 'drone.telemetry',
  NOTIFICATIONS: 'notifications',
} as const

export let isKafkaConnected = false
let producer: Producer | null = null
let consumer: Consumer | null = null

// In-Memory Fallback Event Bus
class InMemEventBus extends EventEmitter {
  async emitEvent(topic: string, event: Record<string, any>): Promise<void> {
    this.emit(topic, event)
  }

  onEvent(topic: string, handler: (event: Record<string, any>) => void): void {
    this.on(topic, handler)
  }
}

export const inMemBus = new InMemEventBus()

export async function initKafka(): Promise<void> {
  try {
    const kafka = new Kafka({
      clientId: ENV.KAFKA_CLIENT_ID,
      brokers: ENV.KAFKA_BROKERS,
      logLevel: logLevel.NOTHING,
      connectionTimeout: 2000,
    })

    const testProducer = kafka.producer()
    await testProducer.connect()
    producer = testProducer
    isKafkaConnected = true
    console.log('✅ [Kafka] Connected successfully to brokers:', ENV.KAFKA_BROKERS.join(', '))

    // Initialize Consumer
    consumer = kafka.consumer({ groupId: ENV.KAFKA_GROUP_ID })
    await consumer.connect()
    await consumer.subscribe({ topics: [TOPICS.ORDER_EVENTS, TOPICS.DRONE_TELEMETRY], fromBeginning: false })

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const payloadStr = message.value?.toString()
        if (payloadStr) {
          try {
            const data = JSON.parse(payloadStr)
            inMemBus.emit(topic, data)
          } catch {
            // ignore malformed
          }
        }
      },
    })
  } catch {
    console.warn('⚠️ [Kafka] Offline or unreachable. Using In-Memory EventBus adapter.')
    isKafkaConnected = false
    producer = null
    consumer = null
  }
}

export const eventStream = {
  async publish(topic: string, payload: Record<string, any>): Promise<void> {
    const timestamp = new Date().toISOString()
    const enriched = { ...payload, publishedAt: timestamp }

    // Always notify in-memory listeners
    await inMemBus.emitEvent(topic, enriched)

    // Publish to real Kafka broker if active
    if (isKafkaConnected && producer) {
      try {
        await producer.send({
          topic,
          messages: [{ value: JSON.stringify(enriched) }],
        })
      } catch (err: any) {
        console.warn(`[Kafka] Failed to send message to ${topic}:`, err.message)
      }
    }
  },

  subscribe(topic: string, callback: (event: Record<string, any>) => void): void {
    inMemBus.onEvent(topic, callback)
  },
}
