import { Zap, Thermometer, Award, Leaf, ArrowUpRight } from 'lucide-react'

export function WhyChooseUs() {
  const features = [
    {
      icon: Zap,
      badge: 'SPEED',
      title: 'Sub-20 Minute Drone Routing',
      description:
        'Direct aerial flight corridors bypass gridlock and stoplights, delivering culinary creations straight from kitchen station to your doorstep in minutes.',
      color: 'amber',
    },
    {
      icon: Thermometer,
      badge: 'TEMPERATURE',
      title: '68°C Thermal Lock Pods',
      description:
        'Patented carbon-insulated pods regulate interior humidity and heat, ensuring French fries remain crispy and ramen broth stays piping hot.',
      color: 'orange',
    },
    {
      icon: Award,
      badge: 'CULINARY ART',
      title: 'Michelin Partner Kitchens',
      description:
        'We partner exclusively with acclaimed chefs and artisan kitchens. Zero cloud ghost kitchens; only world-class gastronomy.',
      color: 'rose',
    },
    {
      icon: Leaf,
      badge: 'SUSTAINABILITY',
      title: '100% Zero-Emission Fleet',
      description:
        'Fully electric drone logistics paired with plant-based compostable containers. Enjoy Michelin-grade luxury with zero environmental footprint.',
      color: 'emerald',
    },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
          Redefining How the World{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Experiences Food
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          From culinary craft in the kitchen to autonomous flight through the skyline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition-all hover:-translate-y-2 group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
