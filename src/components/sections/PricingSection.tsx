import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'

interface PricingSectionProps {
  onOpenDemo: () => void
}

export function PricingSection({ onOpenDemo }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(true)

  const plans = [
    {
      id: 'starter',
      name: 'Starter Developer',
      description: 'Ideal for prototyping autonomous agent workflows and local testbeds.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: 'COMMUNITY',
      features: [
        'Up to 25,000 free API requests / mo',
        '2 concurrent agent swarm instances',
        'Access to 4 major edge regions',
        'Standard token telemetry',
        'Community Discord & GitHub support',
      ],
      ctaText: 'Deploy Free Sandbox',
      variant: 'secondary' as const,
      isPopular: false,
    },
    {
      id: 'professional',
      name: 'Scale Professional',
      description: 'For high-velocity engineering teams requiring low-latency SLAs.',
      monthlyPrice: 79,
      yearlyPrice: 64, // ~20% discount
      badge: 'MOST POPULAR',
      features: [
        '1,500,000 API requests / mo included',
        'Unlimited parallel agent swarms',
        'All 80+ global edge locations',
        'Sub-5ms median latency routing',
        'Zero-trust cryptographic enclave access',
        'Deterministic execution session recordings',
        'Priority 24/7 engineering chat',
      ],
      ctaText: 'Start 14-Day Free Trial',
      variant: 'primary' as const,
      isPopular: true,
    },
    {
      id: 'enterprise',
      name: 'Mission-Critical Enterprise',
      description: 'Dedicated cloud/on-prem infrastructure with guaranteed zero-jitter SLA.',
      monthlyPrice: 499,
      yearlyPrice: 399,
      badge: 'ENTERPRISE',
      features: [
        'Unlimited high-throughput burst requests',
        'Dedicated isolated hardware TPM clusters',
        '99.999% uptime financial SLA contract',
        'Custom model weights fine-tuning engine',
        'Custom SOC2 Type II & HIPAA BAA',
        'Dedicated Solutions Architect & Slack Channel',
        'Custom on-premise VPC peering',
      ],
      ctaText: 'Schedule Architecture Review',
      variant: 'glow' as const,
      isPopular: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Background glow pools */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRANSPARENT SCALE-AS-YOU-GROW</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-5">
          Predictable Pricing for{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Hyper-Scale Compute
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed mb-8">
          Start for free, scale to hundreds of millions of requests with zero hidden fees.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              !isYearly
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              isYearly
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-mono font-bold">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border-2 border-cyan-500/60 shadow-[0_0_40px_rgba(56,189,248,0.2)] lg:-translate-y-2'
                  : 'bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 shadow-xl backdrop-blur-xl'
              }`}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[11px] font-mono font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-white" />
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-['Outfit']">
                    {plan.name}
                  </h3>
                  {!plan.isPopular && (
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-800/80">
                  <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    / month {isYearly && price > 0 ? '(billed annually)' : ''}
                  </span>
                </div>

                {/* Feature List */}
                <div className="space-y-3 mb-8">
                  <div className="text-xs font-mono font-semibold uppercase text-slate-300 tracking-wider">
                    Included capabilities:
                  </div>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <div
                        className={`p-0.5 rounded-full mt-0.5 shrink-0 ${
                          plan.isPopular
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card CTA Button */}
              <Button
                variant={plan.variant}
                size="md"
                onClick={onOpenDemo}
                className="w-full justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {plan.ctaText}
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Guarantee & Enterprise Note */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2 flex-wrap">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>30-day money-back guarantee on all paid plans. No vendor lock-in. Cancel anytime.</span>
      </div>
    </section>
  )
}
