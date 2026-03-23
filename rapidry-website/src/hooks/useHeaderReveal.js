import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useHeaderReveal(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef?.current;
    if (!section) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const eyebrow = section.querySelector('[data-reveal="eyebrow"]');
      const title = section.querySelector('[data-reveal="title"]');
      const subtitle = section.querySelector('[data-reveal="subtitle"]');

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
        },
      });

      if (eyebrow) {
        timeline.fromTo(
          eyebrow,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
          0
        );
      }

      if (title) {
        timeline.fromTo(
          title,
          { y: '120%' },
          { y: '0%', duration: 0.75, ease: 'power3.out' },
          0.05
        );
      }

      if (subtitle) {
        timeline.fromTo(
          subtitle,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' },
          0.2
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef]);
}
