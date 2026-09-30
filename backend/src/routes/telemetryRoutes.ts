import { Router } from 'express'
import { telemetryController } from '../controllers/telemetryController.js'

const router = Router()

router.get('/snapshot', (req, res) => telemetryController.getSnapshot(req, res))
router.get('/live', (req, res) => telemetryController.streamLive(req, res))

export default router
