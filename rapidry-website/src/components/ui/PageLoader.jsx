import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const SESSION_KEY = 'rapidry_loaded_v2';

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

    gsap.set([brand, est], { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.7 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
      0.3,
    )
      .fromTo(
        brand,
        { opacity: 0, letterSpacing: '-4px' },
        { opacity: 1, letterSpacing: '8px', duration: 0.6 },
        1.0,
      )
      .to(
        est,
        { opacity: 1, duration: 0.4 },
        1.35,
      )
      .to(
        overlay,
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.5,
        },
        1.75,
      )
      .call(() => {
        sessionStorage.setItem(SESSION_KEY, 'true');
        setIsVisible(false);
      }, null, 2.25);

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
      <img
        ref={logoRef}
        src="/IMG_new.png"
        alt="RAPIDRY logo"
        width="80"
        height="80"
        style={{ width: 80, height: 80, objectFit: 'contain' }}
      />

      <div
        ref={brandRef}
        style={{
          color: '#D6B97B',
          fontFamily: 'Source Serif 4, serif',
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
          fontFamily: 'Source Serif 4, serif',
          fontSize: '12px',
          letterSpacing: '0.28em',
        }}
      >
        EST. 2026
      </div>
    </div>
  );
}
