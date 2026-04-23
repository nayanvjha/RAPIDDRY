import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useHeaderReveal from '../../hooks/useHeaderReveal';
import { trackConversion } from '../../utils/gtag';

gsap.registerPlugin(ScrollTrigger);

const COVERED_SECTORS = new Set(Array.from({ length: 50 }, (_, index) => `SEC ${index + 1}`));

const ZONES = [
  'Golf Course Road',
  'DLF Phases',
  'Cyber City',
  'Sohna Road',
  'NH-48',
  'MG Road',
  'Sector 44',
  'Sector 66',
];

const HOTSPOT_TARGETS = [];

const hexClip = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

export default function CoverageMap() {
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const sectionRef = useRef(null);
  const mapFrameRef = useRef(null);
  const hexRefs = useRef([]);
  const [tooltip, setTooltip] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState('');

  useHeaderReveal(sectionRef);

  const sectors = useMemo(() => {
    const list = [];
    const cols = 10;
    const rows = 5;

    for (let index = 0; index < cols * rows; index += 1) {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const label = `SEC ${index + 1}`;
      list.push({
        id: `${label}-${index}`,
        label,
        row,
        col,
        covered: COVERED_SECTORS.has(label),
      });
    }

    return list;
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const ordered = hexRefs.current
        .filter(Boolean)
        .slice()
        .sort((a, b) => {
          const ax = Number(a.dataset.cx);
          const ay = Number(a.dataset.cy);
          const bx = Number(b.dataset.cx);
          const by = Number(b.dataset.cy);
          const distA = Math.hypot(ax, ay);
          const distB = Math.hypot(bx, by);
          return distA - distB;
        });

      gsap.fromTo(
        ordered,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'back.out(1.4)',
          stagger: 0.03,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleEnter = (event, sector) => {
    const bounds = mapFrameRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setTooltip({
      x: event.clientX - bounds.left + 10,
      y: event.clientY - bounds.top - 14,
      sector,
    });
  };

  const handleMove = (event, sector) => {
    const bounds = mapFrameRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    setTooltip({
      x: event.clientX - bounds.left + 10,
      y: event.clientY - bounds.top - 14,
      sector,
    });
  };

  const handleLeave = () => {
    setTooltip(null);
  };

  const handleNotifySubmit = (event) => {
    event.preventDefault();
    console.log('coverage-notify', {
      notifyEmail,
      emailjsServiceId,
      emailjsTemplateId,
      emailjsPublicKey,
    });
    trackConversion('lead_form');
    setNotifyEmail('');
  };

  return (
    <section id="coverage" ref={sectionRef} className="bg-cream py-[100px] text-forest-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p data-reveal="eyebrow" className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">
            LAUNCHING IN JUNE
          </p>
          <h2 className="mt-4 overflow-hidden font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            <span data-reveal="title" className="block">
              Coming Soon in <span className="italic">Gurgaon</span>.
            </span>
          </h2>
          <p data-reveal="subtitle" className="mt-4 font-body text-sm text-forest-dark/70">
            Register below to get notified when we launch in your sector.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <p className="mb-3 text-center font-body text-xs text-forest-dark/65 md:hidden">&larr; Scroll to explore &rarr;</p>
          <div ref={mapFrameRef} className="relative overflow-x-auto rounded-3xl bg-forest-dark p-4 sm:p-8 md:p-12">
              <div className="mx-auto min-w-[640px] md:min-w-0">
                <div className="grid grid-cols-10 gap-2 sm:gap-3 md:gap-4">
              {sectors.map((sector, index) => (
                <div
                  key={sector.id}
                  ref={(node) => {
                    hexRefs.current[index] = node;
                  }}
                  data-cx={sector.col - 2.5}
                  data-cy={sector.row - 2}
                  className={`relative flex h-[56px] w-[56px] flex-col items-center justify-center text-center transition duration-200 sm:h-[70px] sm:w-[70px] md:h-[86px] md:w-[86px] ${
                    sector.covered ? 'cursor-pointer' : 'cursor-pointer'
                  } ${sector.row % 2 === 1 ? 'translate-x-3 sm:translate-x-5 md:translate-x-6' : ''}`}
                  style={{ clipPath: hexClip }}
                  onMouseEnter={(event) => handleEnter(event, sector)}
                  onMouseMove={(event) => handleMove(event, sector)}
                  onMouseLeave={handleLeave}
                >
                  <div
                    className={`absolute inset-0 rounded-xl transition duration-200 ${
                      sector.covered
                        ? 'bg-[rgba(214,185,123,0.1)] border border-[rgba(214,185,123,0.25)]'
                        : 'bg-[rgba(15,46,42,0.8)] border border-[rgba(243,239,230,0.05)]'
                    } ${tooltip?.sector.id === sector.id && sector.covered ? 'shadow-[0_0_20px_rgba(214,185,123,0.2)]' : ''}`}
                    style={{
                      borderWidth: sector.covered && tooltip?.sector.id === sector.id ? '1.5px' : undefined,
                      background:
                        !sector.covered && tooltip?.sector.id === sector.id
                          ? 'linear-gradient(135deg, rgba(15,46,42,0.85), rgba(214,185,123,0.08))'
                          : undefined,
                    }}
                  />
                  {!sector.covered && (
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(135deg, rgba(243,239,230,0.12) 0, rgba(243,239,230,0.12) 2px, transparent 2px, transparent 6px)' }} />
                  )}

                  <div className="relative z-10">
                    <div className={`font-body text-[8px] font-bold sm:text-[10px] md:text-[11px] ${sector.covered ? 'text-cream/60' : 'text-cream/20'}`}>
                      {sector.label}
                    </div>
                    <div
                      className={`font-body text-[8px] sm:text-[9px] md:text-[10px] ${
                        sector.covered
                          ? 'text-emerald-300/90'
                          : tooltip?.sector.id === sector.id
                            ? 'text-gold/80'
                            : 'text-cream/35'
                      }`}
                    >
                      {sector.covered ? 'Covered' : 'Coming Soon'}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {HOTSPOT_TARGETS.map((label, index) => {
              const target = sectors.find((sector) => sector.label === label);
              if (!target) {
                return null;
              }
              const offsetX = target.row % 2 === 1 ? 24 : 0;
              const left = target.col * 102 + offsetX + 43;
              const top = target.row * 102 + 43;

              return (
                <div
                  key={`hotspot-${label}`}
                  className="pointer-events-none absolute"
                  style={{ left, top, transform: 'translate(-50%, -50%)' }}
                >
                  {[0, 1, 2].map((ring) => (
                    <span
                      key={`${label}-ring-${ring}`}
                      className="absolute inset-0 rounded-full border border-gold/60"
                      style={{ animation: `pulse-ring 2s ease-out ${ring * 0.5}s infinite` }}
                    />
                  ))}
                  <span className="relative block h-3 w-3 rounded-full bg-gold" />
                </div>
              );
            })}

            {tooltip && (
              <div
                className="pointer-events-none absolute z-10 w-[210px] -translate-y-full rounded-xl border border-gold/20 bg-forest-mid p-4 text-left"
                style={{ left: tooltip.x, top: tooltip.y }}
              >
                <p className="font-body text-sm font-semibold text-white">{tooltip.sector.label.replace('SEC', 'Sector')}</p>
                <p className={`mt-2 font-body text-xs ${tooltip.sector.covered ? 'text-emerald-300' : 'text-gold/90'}`}>
                  {tooltip.sector.covered ? 'Covered' : 'Coming Soon'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-center gap-2 md:gap-3">
          {ZONES.map((zone) => (
            <button
              key={zone}
              type="button"
              className="rounded-full border border-gold/50 px-2.5 py-1.5 font-body text-xs text-forest-dark transition hover:bg-gold hover:text-forest-dark sm:px-4 sm:py-2 sm:text-sm"
            >
              {zone}
            </button>
          ))}
        </div>

        <form className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 sm:flex-row" onSubmit={handleNotifySubmit}>
          <input
            type="email"
            placeholder="Enter your email for upcoming sectors"
            value={notifyEmail}
            onChange={(event) => setNotifyEmail(event.target.value)}
            className="h-12 w-full rounded-full border border-gold/35 bg-white px-5 font-body text-sm text-forest-dark placeholder:text-forest-dark/45 focus:border-gold focus:outline-none"
            required
          />
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-gold px-6 font-body text-sm font-semibold uppercase tracking-[0.08em] text-forest-dark sm:w-auto"
          >
            Notify Me
          </button>
        </form>
      </div>
    </section>
  );
}
