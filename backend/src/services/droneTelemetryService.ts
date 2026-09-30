import type { Response } from 'express'
import { cache } from '../config/redis.js'
import { eventStream, TOPICS } from '../config/kafka.js'
import type { DroneTelemetry } from '../domain/types.js'

export class DroneTelemetryService {
  private sseClients: Set<Response> = new Set()
  private currentTelemetry: DroneTelemetry
  private timer: NodeJS.Timeout | null = null

  constructor() {
    this.currentTelemetry = {
      droneId: 'POD-DRONE-X9',
      status: 'in_flight',
      altitudeMeters: 48.0,
      speedKmH: 52.0,
      podTemperature: 68.5,
      corridor: 'Direct Flight Corridor #12',
      etaMinutes: 14,
      distanceKm: 4.2,
      courierName: 'Autonomous Aeronav Pod',
      destinationAddress: 'Skyline Tower, Suite 44B (Balcony Pad)',
      milestones: [
        { label: 'Plated by Executive Chef', completed: true, timestamp: '10:48 AM • Kitchen Station 04' },
        { label: 'Hermetically Sealed in Thermal Pod', completed: true, timestamp: '10:51 AM • Locked at 68.5°C' },
        { label: 'Airborne En Route to Destination', completed: true, timestamp: '10:53 AM • Passing Financial District' },
        { label: 'Gentle Landing at Rooftop / Balcony', completed: false, timestamp: 'Estimated 11:06 AM' },
      ],
      timestamp: new Date().toISOString(),
    }

    this.startSimulationLoop()
  }

  private startSimulationLoop() {
    let tick = 0
    this.timer = setInterval(async () => {
      tick++

      // Realistic physical variations
      const altitudeNoise = Math.sin(tick * 0.2) * 1.5
      const speedNoise = Math.cos(tick * 0.15) * 2.2
      const tempNoise = Math.sin(tick * 0.1) * 0.2

      this.currentTelemetry = {
        ...this.currentTelemetry,
        altitudeMeters: parseFloat((48.0 + altitudeNoise).toFixed(1)),
        speedKmH: parseFloat((52.0 + speedNoise).toFixed(1)),
        podTemperature: parseFloat((68.5 + tempNoise).toFixed(1)),
        etaMinutes: Math.max(1, Math.round(14 - (tick % 60) * 0.2)),
        timestamp: new Date().toISOString(),
      }

      // Cache current telemetry in Redis (5s TTL)
      await cache.set('telemetry:active', JSON.stringify(this.currentTelemetry), 5)

      // Publish to Kafka and Redis pub/sub
      await eventStream.publish(TOPICS.DRONE_TELEMETRY, this.currentTelemetry)

      // Broadcast to connected SSE HTTP streams
      this.broadcastSSE(this.currentTelemetry)
    }, 2500)
  }

  public getSnapshot(): DroneTelemetry {
    return this.currentTelemetry
  }

  public registerSSEClient(res: Response) {
    this.sseClients.add(res)

    // Immediately send current state
    res.write(`data: ${JSON.stringify(this.currentTelemetry)}\n\n`)

    res.on('close', () => {
      this.sseClients.delete(res)
    })
  }

  private broadcastSSE(data: DroneTelemetry) {
    const payload = `data: ${JSON.stringify(data)}\n\n`
    for (const client of this.sseClients) {
      try {
        client.write(payload)
      } catch {
        this.sseClients.delete(client)
      }
    }
  }

  public destroy() {
    if (this.timer) clearInterval(this.timer)
  }
}

export const droneTelemetryService = new DroneTelemetryService()
