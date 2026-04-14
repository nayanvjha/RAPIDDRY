import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StartupIndiaBadge from '../StartupIndiaBadge';

const STATS = [
  {
    key: 'market',
    label: 'Indian Laundry Market',
    target: 350000,
    format: (value) => `₹${(Math.round(value) / 100000).toFixed(1)} Lakh Cr`,
  },
  {
    key: 'unorganised',
    label: 'Market unorganised',
    target: 95,
    format: (value) => `${Math.round(value)}%`,
  },
  {
    key: 'turnaround',
    label: 'Express Delivery',
    target: 3,
    format: (value) => `${Math.round(value)} hrs`,
  },
  {
    key: 'accountability',
    label: 'Accountability guaranteed',
    target: 100,
    format: (value) => `${Math.round(value)}%`,
  },
];

export default function StatsStrip() {
  const sectionRef = useRef(null);
  const valueRefs = useRef([]);

  const registerValueRef = (element) => {
    if (element && !valueRefs.current.includes(element)) {
      valueRefs.current.push(element);
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      STATS.forEach((stat, index) => {
        const element = valueRefs.current[index];
        if (element) {
          element.textContent = stat.format(stat.target);
        }
      });
      return undefined;
    }

    const counters = STATS.map(() => ({ value: 0 }));
    gsap.set(valueRefs.current, { filter: 'blur(10px)', opacity: 0.4 });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        counters.forEach((counter, index) => {
          gsap.to(counter, {
            value: STATS[index].target,
            duration: 2,
            ease: 'power2.out',
            delay: index * 0.2,
            onUpdate: () => {
              const element = valueRefs.current[index];
              if (element) {
                element.textContent = STATS[index].format(counter.value);
              }
            },
          });

          const element = valueRefs.current[index];
          if (element) {
            gsap.to(element, {
              filter: 'blur(0px)',
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
              delay: index * 0.2,
            });
          }
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full border-b border-t border-[#EAE4D8] bg-cream py-8"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid w-full grid-cols-2 gap-4 md:flex md:items-center md:justify-between md:gap-4">
          {STATS.map((stat, index) => (
            <div key={stat.key} className="flex min-w-0 flex-1 items-center justify-center gap-3 text-center">
              <div className="text-center">
                <div
                  ref={registerValueRef}
                  className="font-display text-[22px] font-bold leading-none text-forest-dark sm:text-[28px] md:text-[40px]"
                >
                  {stat.format(0)}
                </div>
                <div className="mt-2 font-body text-[11px] text-slate-500 md:text-[13px]">{stat.label}</div>
              </div>

              {index < STATS.length - 1 ? <span className="hidden h-[44px] w-px bg-gold/40 md:block" /> : null}
            </div>
          ))}
        </div>

        <div className="mt-7 flex justify-center">
          <StartupIndiaBadge variant="inline" tone="dark" className="max-w-[90vw] scale-90 sm:scale-100" />
        </div>
      </div>
    </section>
  );
}
