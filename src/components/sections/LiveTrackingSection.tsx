import { useState, useEffect } from 'react'
import { Thermometer, Radio, Navigation, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { DeliveryDrone3D } from '../3d/DeliveryDrone3D'
import { api } from '../../api/client'
import type { DroneTelemetry } from '../../types'

export function LiveTrackingSection() {
  const [telemetry, setTelemetry] = useState<DroneTelemetry>({
    droneId: 'POD-DRONE-X9',
    droneSpeedKmH: 52.0,
    speedKmH: 52.0,
    currentStatus: 'in_flight',
    status: 'in_flight',
    altitudeMeters: 48.0,
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
  })
  const [isLiveConnected, setIsLiveConnected] = useState(false)

  useEffect(() => {
    const unsubscribe = api.subscribeDroneTelemetry(
      (data) => {
        setTelemetry(data)
        setIsLiveConnected(true)
      },
      () => {
        setIsLiveConnected(false)
      }
    )
    return () => {
      unsubscribe()
    }
  }, [])

  const eta = telemetry.etaMinutes
  const temperature = telemetry.podTemperature
  const droneId = telemetry.droneId

  return (
    <section id="tracking" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-orange-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>AUTONOMOUS AIRWAYS RADAR</span>
          {isLiveConnected && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
              SSE LIVE
            </span>
          )}
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
          Real-Time 3D{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Drone Fleet Tracking
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          Every order is transported inside our patented hermetic thermal pods. Watch your delivery
          glide through the sky with live telemetry, speed, and interior climate sensors.
        </p>
      </div>

      {/* Live 3D Radar Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Left: 3D Drone Flight Simulation */}
        <div className="lg:col-span-7 h-[380px] sm:h-[460px] relative rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-950/90 border border-slate-800 overflow-hidden">
          <DeliveryDrone3D />

          {/* Overlaid Live Badges */}
          <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/85 border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-white font-bold">{droneId}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Air Altitude: {telemetry.altitudeMeters}m // Speed: {telemetry.speedKmH} km/h
            </p>
          </div>

          <div className="absolute bottom-4 right-4 p-2.5 rounded-xl bg-slate-900/85 border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <Navigation className="w-3.5 h-3.5" />
              <span>{telemetry.corridor}</span>
            </div>
          </div>
        </div>

        {/* Right: Live Flight Metrics & Timeline */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Estimated Arrival</span>
              </div>
              <div className="text-3xl font-black text-white font-mono">{eta} mins</div>
              <span className="text-[10px] text-emerald-400 font-mono">On schedule</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Pod Temperature</span>
              </div>
              <div className="text-3xl font-black text-amber-400 font-mono">{temperature}°C</div>
              <span className="text-[10px] text-slate-400 font-mono">Thermal Lock Active</span>
            </div>
          </div>

          {/* Delivery Flight Progress Steps */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h4 className="text-xs font-mono uppercase text-slate-300 font-bold mb-3">
              Live Order Milestones:
            </h4>

            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <span className="text-white font-semibold">Plated by Executive Chef</span>
                <span className="text-[10px] text-slate-500 block">10:48 AM • Kitchen Station 04</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1">
                <span className="text-white font-semibold">Hermetically Sealed in Thermal Pod</span>
                <span className="text-[10px] text-slate-500 block">10:51 AM • Locked at 69.1°C</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div className="flex-1">
                <span className="text-amber-300 font-semibold">Airborne En Route to Destination</span>
                <span className="text-[10px] text-slate-400 block">Passing over Financial District</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs opacity-50">
              <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              <div className="flex-1">
                <span className="text-slate-400">Gentle Landing at Rooftop / Balcony</span>
                <span className="text-[10px] text-slate-600 block">Estimated 11:06 AM</span>
              </div>
            </div>
          </div>

          {/* Destination Address Pill */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-white font-bold block">Skyline Tower, Suite 44B</span>
                <span className="text-[10px] text-slate-400">Balcony Pad Enabled</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">
              GPS Calibrated
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
