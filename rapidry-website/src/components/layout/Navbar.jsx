import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMagnetic from '../../hooks/useMagnetic';

const NAV_LINKS = [
  { label: 'Services', id: 'services' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Coverage', id: 'coverage' },
  { label: 'Reviews', id: 'reviews' },
  { label: 'Download', id: 'download' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const menuLinkRefs = useRef([]);
  const ctaMagnetic = useMagnetic(12);

  const registerMenuLinkRef = (el) => {
    if (el && !menuLinkRefs.current.includes(el)) {
      menuLinkRefs.current.push(el);
    }
  };

  const scrollToId = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      start: 80,
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(menu, { display: isMenuOpen ? 'flex' : 'none', autoAlpha: isMenuOpen ? 1 : 0 });
      return;
    }

    if (isMenuOpen) {
      gsap.set(menu, { display: 'flex' });
      gsap.fromTo(
        menu,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25, ease: 'power2.out' },
      );
      gsap.fromTo(
        menuLinkRefs.current,
        { x: 28, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out', stagger: 0.06 },
      );
      return;
    }

    gsap.to(menu, {
      autoAlpha: 0,
      duration: 0.2,
      onComplete: () => {
        gsap.set(menu, { display: 'none' });
      },
    });
  }, [isMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed inset-x-0 top-0 z-50 h-[72px] text-white"
        style={{
          transition: 'all 0.4s ease',
          backgroundColor: isScrolled ? 'rgba(15,46,42,0.95)' : 'rgba(15,46,42,0.7)',
          backdropFilter: 'blur(24px)',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-6">
          <button
            className="flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Go to top"
          >
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <path
                d="M16 20 L32 8 L48 20 L44 44 C44 44 38 38 32 38 C26 38 20 44 20 44 L16 20 Z"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
                strokeLinejoin="round"
              />
              <path d="M32 8 L32 38" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2 3" />
            </svg>
            <span className="font-display text-[18px] font-bold tracking-[2px] text-white">RAPIDRY</span>
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className="group relative font-body text-[14px] font-medium text-white/90 transition-opacity hover:text-white"
                onClick={() => scrollToId(link.id)}
              >
                {link.label}
                <span className="pointer-events-none absolute -bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-white transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="https://wa.me/917070311787"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-body text-sm text-white/90 hover:text-white"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              WhatsApp us
            </a>
            <a
              href="#download"
              onClick={(event) => {
                event.preventDefault();
                scrollToId('download');
              }}
              ref={ctaMagnetic.ref}
              onMouseMove={ctaMagnetic.handleMouseMove}
              onMouseLeave={ctaMagnetic.handleMouseLeave}
              className="rounded-full bg-gold px-[22px] py-[10px] text-sm font-semibold text-white transition-transform duration-200"
              style={{ boxShadow: '0 8px 24px rgba(214,185,123,0.35)' }}
            >
              Get the App
            </a>
          </div>

          <button
            aria-label="Toggle menu"
            className="relative h-10 w-10 lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            <span
              className="absolute left-2 top-3 h-[2px] w-6 bg-gold transition-all duration-300"
              style={{ transform: isMenuOpen ? 'translateY(8px) rotate(45deg)' : 'none' }}
            />
            <span
              className="absolute left-2 top-5 h-[2px] w-6 bg-gold transition-all duration-300"
              style={{ opacity: isMenuOpen ? 0 : 1 }}
            />
            <span
              className="absolute left-2 top-7 h-[2px] w-6 bg-gold transition-all duration-300"
              style={{ transform: isMenuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      <div
        ref={menuRef}
        className="fixed inset-0 hidden flex-col bg-forest-dark px-8 pt-24"
        style={{ zIndex: 999 }}
      >
        <button
          className="absolute right-6 top-6 text-4xl leading-none text-cream"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        >
          ×
        </button>

        <div className="mt-10 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={`mobile-${link.id}`}
              ref={registerMenuLinkRef}
              className="text-left font-display text-[36px] leading-none text-cream"
              onClick={() => {
                scrollToId(link.id);
                setIsMenuOpen(false);
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="https://wa.me/917070311787"
            target="_blank"
            rel="noreferrer"
            className="mt-4 text-left font-body text-lg text-gold"
            onClick={() => setIsMenuOpen(false)}
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </>
  );
}
