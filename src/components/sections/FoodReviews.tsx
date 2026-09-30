import { Star, Quote } from 'lucide-react'

export function FoodReviews() {
  const reviews = [
    {
      name: 'Chef Anthony Laurent',
      role: 'Michelin Guide Reviewer',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=160&h=160&q=80',
      dish: 'Neo Wagyu Truffle Burger',
      quote:
        'I was skeptical about drone delivery until I opened the pod. The Wagyu brioche was still warm with pristine steam rising, and the truffle gouda was perfectly molten.',
      rating: 5,
    },
    {
      name: 'Maya Lin',
      role: 'Culinary Journalist & Tech Critic',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80',
      dish: 'Kyoto Black Garlic Tonkotsu',
      quote:
        'The hand-pulled noodles retained their perfect al dente spring, and the nitamago egg yolk oozed like it came directly from the kitchen counter 30 seconds ago.',
      rating: 5,
    },
    {
      name: 'Jonathan Vance',
      role: 'Executive Architect, FinTech HQ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80',
      dish: 'Smoked Prosciutto Pizza',
      quote:
        'Being able to inspect each pizza topping in 3D before ordering is addictive. The crust arrived blistering hot on our high-rise balcony pad in just 14 minutes.',
      rating: 5,
    },
  ]

  return (
    <section id="reviews" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
          Celebrated by{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Food Critics & Connoisseurs
          </span>
        </h2>
        <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
          Over 40,000 gourmet deliveries completed with an average rating of 4.96 / 5.0.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-2xl relative"
          >
            <Quote className="absolute top-6 right-6 w-12 h-12 text-slate-800/40 pointer-events-none" />

            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-4">
                {Array.from({ length: rev.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-mono text-slate-400 ml-2 font-semibold">
                  {rev.dish}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                &ldquo;{rev.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-500/40"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                <p className="text-xs text-slate-500">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
