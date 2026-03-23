import { useLayoutEffect, useRef } from 'react';
import { Clock3, ShoppingBag, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useHeaderReveal from '../../hooks/useHeaderReveal';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Schedule in 60 seconds',
    description: 'Open the app, pick your service, choose a slot, and confirm pickup in under a minute.',
    Icon: Clock3,
  },
  {
    number: '02',
    title: 'We collect your clothes',
    description: 'Our verified agent arrives at your doorstep, checks the order, and safely packs every item.',
    Icon: ShoppingBag,
  },
  {
    number: '03',
    title: 'Fresh clothes delivered',
    description: 'Professionally cleaned, quality-checked, and delivered back crisp, neat, and ready to wear.',
    Icon: Sparkles,
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useHeaderReveal(sectionRef);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="bg-cream px-6 py-[110px] text-forest-dark">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p data-reveal="eyebrow" className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">
            HOW IT WORKS
          </p>
          <h2 className="mt-4 overflow-hidden font-display text-4xl font-bold leading-tight md:text-5xl">
            <span data-reveal="title" className="block">
              Fresh clothes in <span className="italic">3 simple steps.</span>
            </span>
          </h2>
          <p data-reveal="subtitle" className="mx-auto mt-4 max-w-2xl font-body text-sm text-forest-dark/70">
            Every pickup is tracked, verified, and quality-checked before it returns to your door.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <article
              key={step.number}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className="rounded-3xl border border-cream-dark bg-white p-7 shadow-[0_12px_30px_rgba(15,46,42,0.08)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
                <step.Icon size={26} />
              </span>
              <p className="mt-5 font-display text-3xl font-bold text-gold">{step.number}</p>
              <h3 className="mt-3 font-display text-xl font-semibold text-forest-dark">{step.title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-forest-dark/70">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
