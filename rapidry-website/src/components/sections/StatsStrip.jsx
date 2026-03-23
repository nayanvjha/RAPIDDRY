import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS = [
  {
    key: 'market',
    label: 'Indian laundry market',
    target: 70000,
    format: (value) => `₹${Math.round(value).toLocaleString('en-IN')} Cr`,
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
      className="flex h-[130px] w-full items-center justify-center border-b border-t border-[#EAE4D8] bg-cream px-6"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 md:gap-4">
        {STATS.map((stat, index) => (
          <div key={stat.key} className="flex flex-1 items-center justify-center gap-3">
            <div className="text-center">
              <div
                ref={registerValueRef}
                className="font-display text-[28px] font-bold leading-none text-forest-dark md:text-[40px]"
              >
                {stat.format(0)}
              </div>
              <div className="mt-2 font-body text-[11px] text-slate-500 md:text-[13px]">{stat.label}</div>
            </div>

            {index < STATS.length - 1 ? <span className="hidden h-[44px] w-px bg-gold/40 md:block" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
