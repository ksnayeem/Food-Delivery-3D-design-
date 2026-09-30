import type { Request, Response } from 'express'
import { droneTelemetryService } from '../services/droneTelemetryService.js'

export class TelemetryController {
  getSnapshot(req: Request, res: Response) {
    const data = droneTelemetryService.getSnapshot()
    res.status(200).json({
      success: true,
      data,
    })
  }

  streamLive(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.flushHeaders?.()

    droneTelemetryService.registerSSEClient(res)
  }
}

export const telemetryController = new TelemetryController()
