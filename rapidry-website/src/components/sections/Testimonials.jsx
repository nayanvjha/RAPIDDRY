import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../../data/brand';

const TICKER_MESSAGES = [
  '🟢 Priya from Sector 44 just placed an order',
  "✅ Rahul's dry cleaning delivered · Sector 29",
  '⭐ Sneha rated her pickup 5 stars · Sector 66',
  '📦 12 orders picked up in DLF this morning',
  '🚴 4 agents active near Cyber City right now',
];

export default function Testimonials() {
  const marqueeItems = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section id="reviews" className="relative overflow-hidden bg-forest-dark px-6 py-[80px] text-cream">
      <div className="group mx-auto max-w-6xl overflow-hidden rounded-full border border-gold/15 bg-gold/5">
        <div className="flex w-max animate-ticker group-hover:[animation-play-state:paused]" style={{ animationDuration: '30s' }}>
          {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((message, index) => (
            <p key={`${message}-${index}`} className="flex h-[44px] items-center px-6 font-body text-sm text-cream/85">
              {message}
            </p>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-10 top-[120px] font-display text-[160px] leading-none text-gold/10">“</div>

      <div className="relative mx-auto mt-12 max-w-6xl">
        <style>
          {`
            @keyframes marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
          `}
        </style>

        <div className="group space-y-6">
          <div className="overflow-hidden">
            <div
              className="flex w-max gap-6 group-hover:[animation-play-state:paused]"
              style={{ animation: 'marquee-left 40s linear infinite' }}
            >
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <article
                  key={`row1-${item.name}-${index}`}
                  className="w-[380px] rounded-[20px] border border-[rgba(214,185,123,0.12)] bg-[rgba(24,63,58,0.6)] p-7 backdrop-blur-[16px] transition duration-200 group-hover:opacity-70 hover:scale-[1.03] hover:border-[rgba(214,185,123,0.3)] hover:opacity-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[16px] italic leading-[1.7] text-cream">“{item.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold font-display text-sm font-bold text-gold">
                      {item.initials}
                    </span>
                    <div>
                      <p className="font-body text-[14px] font-semibold text-gold">{item.name}</p>
                      <p className="font-body text-xs text-cream/50">{item.location}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex w-max gap-6 group-hover:[animation-play-state:paused]"
              style={{ animation: 'marquee-right 45s linear infinite' }}
            >
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <article
                  key={`row2-${item.name}-${index}`}
                  className="w-[380px] rounded-[20px] border border-[rgba(214,185,123,0.12)] bg-[rgba(24,63,58,0.6)] p-7 backdrop-blur-[16px] transition duration-200 group-hover:opacity-70 hover:scale-[1.03] hover:border-[rgba(214,185,123,0.3)] hover:opacity-100 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[16px] italic leading-[1.7] text-cream">“{item.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-gold font-display text-sm font-bold text-gold">
                      {item.initials}
                    </span>
                    <div>
                      <p className="font-body text-[14px] font-semibold text-gold">{item.name}</p>
                      <p className="font-body text-xs text-cream/50">{item.location}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
