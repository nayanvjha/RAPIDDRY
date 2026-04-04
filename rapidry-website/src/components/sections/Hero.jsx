import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, Phone } from 'lucide-react';
import useMagnetic from '../../hooks/useMagnetic';

export default function Hero() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const eyebrowRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const videoRef = useRef(null);
  const scrollHintRef = useRef(null);
  const primaryMagnetic = useMagnetic(18);
  const secondaryMagnetic = useMagnetic(12);

  const smoothScrollTo = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    const section = heroRef.current;
    if (!section) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      [eyebrowRef.current, headlineRef.current, subtitleRef.current, ctaRef.current, statsRef.current].forEach((element) => {
        if (element) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0px)';
        }
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, headlineRef.current, subtitleRef.current, ctaRef.current, statsRef.current], {
        opacity: 0,
        y: 20,
      });

      gsap.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 });
      gsap.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 },
      );
      gsap.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 });
      gsap.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.0 });
      gsap.to(statsRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 1.2 });
      gsap.to(scrollHintRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.4 });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden bg-[#1a1a1a]">
      <div className="absolute inset-0 bg-[#1a1a1a]" />
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'%3E%3Crect width='100%25' height='100%25' fill='%231a1a1a'/%3E%3C/svg%3E"
          src="https://res.cloudinary.com/dpoa1psmc/video/upload/v1774170228/download_fdstec.mp4"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.1)_40%,rgba(0,0,0,0.5)_80%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center md:px-6">
        <div
          ref={eyebrowRef}
          className="mb-6 inline-flex w-fit items-center rounded-full border border-white/20 bg-[rgba(0,0,0,0.3)] px-4 py-2 font-body text-[12px] font-medium text-white backdrop-blur-md"
        >
          ✦&nbsp;&nbsp;Gurgaon&apos;s Premium Laundry Service
        </div>

        <h1
          ref={headlineRef}
          className="font-display text-[clamp(28px,7vw,76px)] font-bold leading-[1.05] text-white"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
        >
          Your wardrobe, <span className="italic">professionally</span> cared for<span className="text-gold">.</span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-6 max-w-sm font-body text-[14px] leading-[1.8] text-white/85 md:max-w-xl md:text-[16px]"
          style={{ textShadow: '0 1px 10px rgba(0,0,0,0.4)' }}
        >
          Ironed clothes in 40 minutes. From pickup to delivery — fresh clothes at your door in as fast as 3 hours. Real-time tracking. Zero accountability issues. Premium care for every garment.
        </p>

        <div ref={ctaRef} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#download"
            onClick={(event) => {
              event.preventDefault();
              smoothScrollTo('download');
            }}
            ref={primaryMagnetic.ref}
            onMouseMove={primaryMagnetic.handleMouseMove}
            onMouseLeave={primaryMagnetic.handleMouseLeave}
            className="inline-flex h-14 items-center gap-2 rounded-full bg-gold px-7 font-body text-[15px] font-semibold text-forest-dark transition-transform duration-200"
            style={{ boxShadow: '0 8px 32px rgba(214,185,123,0.35)' }}
          >
            <Phone size={18} />
            Download the App
          </a>

          <button
            ref={secondaryMagnetic.ref}
            onMouseMove={secondaryMagnetic.handleMouseMove}
            onMouseLeave={secondaryMagnetic.handleMouseLeave}
            className="inline-flex h-14 items-center gap-2 rounded-full border-[1.5px] border-white/40 px-7 font-body text-[15px] font-medium text-white transition-colors hover:bg-white/10"
            onClick={() => smoothScrollTo('how-it-works')}
          >
            How It Works <ArrowDown size={16} />
          </button>
        </div>

        <div ref={statsRef} className="mt-9 flex items-center justify-center gap-4 font-body text-white md:gap-8">
          <div className="text-center">
            <div className="font-display text-[22px] font-bold text-white md:text-[28px]">3 hrs</div>
            <div className="text-[12px] text-white/60">Express Delivery</div>
          </div>
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center opacity-0 md:flex"
      >
        <p className="font-body text-[11px] uppercase tracking-[3px] text-white/60">scroll to discover</p>
      </div>
    </section>
  );
}
