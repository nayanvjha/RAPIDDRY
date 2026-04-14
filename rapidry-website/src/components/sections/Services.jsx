import { useLayoutEffect, useRef } from 'react';
import { Briefcase, Flame, Footprints, LayoutGrid, ShieldCheck, Shirt, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES } from '../../data/brand';
import useHeaderReveal from '../../hooks/useHeaderReveal';

gsap.registerPlugin(ScrollTrigger);

const ICON_MAP = {
  Shirt,
  Sparkles,
  ShieldCheck,
  Flame,
  Footprints,
  Briefcase,
  LayoutGrid,
};

function ServiceCard({ service, onRef }) {
  const Icon = ICON_MAP[service.icon] ?? Shirt;
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const borderRef = useRef(null);

  const handleMouseMove = (event) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    const border = borderRef.current;

    if (!card || !glow || !border) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const rotateX = -((mouseY - rect.height / 2) / rect.height) * 15;
    const rotateY = ((mouseX - rect.width / 2) / rect.width) * 15;
    const angle = Math.atan2(mouseY - rect.height / 2, mouseX - rect.width / 2) * (180 / Math.PI);

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    glow.style.background = `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(214,185,123,0.15) 0%, transparent 50%)`;
    border.style.background = `conic-gradient(from ${angle}deg, transparent 0deg, rgba(214,185,123,0.5) 60deg, transparent 120deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    const glow = glowRef.current;
    const border = borderRef.current;

    if (!card || !glow || !border) {
      return;
    }

    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    glow.style.background = 'radial-gradient(circle at center, transparent 0%, transparent 60%)';
    border.style.background = 'conic-gradient(from 0deg, transparent 0deg, transparent 120deg)';
  };

  return (
    <article
      ref={onRef}
      className="h-auto min-h-[300px] w-full sm:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
      style={{ perspective: '1000px' }}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={cardRef}
        className="relative h-full w-full rounded-[20px] [transform-style:preserve-3d] transition-[transform] duration-150 ease-out"
      >
        <div ref={borderRef} className="absolute inset-0 rounded-[20px] p-[1px]">
          <div className="relative h-full w-full rounded-[19px] border border-[rgba(214,185,123,0.15)] bg-[rgba(24,63,58,0.95)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] sm:p-8">
            <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-[19px]" />

            <div className="relative z-10 flex h-full flex-col">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Icon size={40} />
              </span>

              <h3 className="mt-6 font-display text-[18px] font-semibold text-white sm:text-[22px]">{service.name}</h3>
              {service.timing && (
                <span className="mt-1 inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-gold/90">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold/70" />
                  {service.timing}
                </span>
              )}

              <ul className="mt-5 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 font-body text-sm text-cream/70">
                    <span className="mt-[2px] text-gold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`https://wa.me/917070311787?text=Hi, I'd like to book ${service.name}`}
                target="_blank"
                rel="noreferrer"
                className="mt-auto w-full rounded-full bg-gold px-5 py-3 font-body text-sm font-semibold uppercase tracking-[0.08em] text-forest-dark transition-transform duration-200 hover:scale-[1.02] text-center inline-block"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
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
        { y: 100, opacity: 0, rotateX: 15 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="bg-cream py-[100px] text-forest-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p data-reveal="eyebrow" className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">
            OUR SERVICES
          </p>
          <h2 className="mt-4 overflow-hidden font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            <span data-reveal="title" className="block">
              Everything your wardrobe needs.
            </span>
          </h2>
          <p data-reveal="subtitle" className="mt-4 font-body text-sm text-forest-dark/70">
            Premium care for everyday wear, delicate fabrics, and everything in between.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              onRef={(node) => {
                cardRefs.current[index] = node;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
