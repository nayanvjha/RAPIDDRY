import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const SESSION_KEY = 'rapidry_loaded';

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const brandRef = useRef(null);
  const estRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const hasLoaded = sessionStorage.getItem(SESSION_KEY) === 'true';
    if (hasLoaded) {
      setIsVisible(false);
      return undefined;
    }

    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsVisible(false);
      return undefined;
    }

    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const brand = brandRef.current;
    const est = estRef.current;

    if (!overlay || !logo || !brand || !est) {
      return undefined;
    }

    const paths = logo.querySelectorAll('path');
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    gsap.set([brand, est], { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(
      paths,
      {
        strokeDashoffset: 0,
        duration: 1,
        stagger: 0.1,
      },
      0.3,
    )
      .fromTo(
        brand,
        { opacity: 0, letterSpacing: '-4px' },
        { opacity: 1, letterSpacing: '8px', duration: 0.6 },
        1.3,
      )
      .to(
        est,
        { opacity: 1, duration: 0.4 },
        1.7,
      )
      .to(
        overlay,
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.5,
        },
        2.0,
      )
      .call(() => {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsVisible(false);
      }, null, 2.5);

    return () => {
      tl.kill();
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#0F2E2A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <svg ref={logoRef} width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path
          d="M16 20 L32 8 L48 20 L44 44 C44 44 38 38 32 38 C26 38 20 44 20 44 L16 20 Z"
          stroke="#D6B97B"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M32 8 L32 38" stroke="#D6B97B" strokeWidth="1" strokeDasharray="2 3" />
      </svg>

      <div
        ref={brandRef}
        style={{
          color: '#D6B97B',
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          fontSize: '48px',
          lineHeight: 1,
          letterSpacing: '-4px',
        }}
      >
        RAPIDRY
      </div>

      <div
        ref={estRef}
        style={{
          color: '#F3EFE6',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '12px',
          letterSpacing: '0.28em',
        }}
      >
        EST. 2026
      </div>
    </div>
  );
}
