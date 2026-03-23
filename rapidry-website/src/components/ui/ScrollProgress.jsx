import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollProgress() {
  const barRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bar.style.width = '100%';
      if (dotRef.current) {
        dotRef.current.style.left = '100%';
      }
      return undefined;
    }

    const tween = gsap.fromTo(
      bar,
      { width: '0%' },
      {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: true,
          onUpdate: (self) => {
            if (dotRef.current) {
              dotRef.current.style.left = `${self.progress * 100}%`;
            }
          },
        },
      },
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div className="fixed left-0 top-[72px] z-[999] h-[4px] w-full bg-transparent">
      <div className="relative h-full w-full">
        <div
          ref={barRef}
          className="h-full shadow-[0_0_14px_rgba(214,185,123,0.6)]"
          style={{
            width: '0%',
            background: 'linear-gradient(to right, #D6B97B, #E8D4A8)',
          }}
        />
        <div
          ref={dotRef}
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(214,185,123,0.85)]"
          style={{ left: '0%' }}
        />
      </div>
    </div>
  );
}
