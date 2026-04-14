import React, { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useHeaderReveal from '../../hooks/useHeaderReveal';

const PhoneMockup = lazy(() => import('../three/PhoneMockup'));

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  'Real-time 5-stage tracking',
  'UPI, Card, COD',
  'Photo verification',
  'Scheduled slots',
  '30-minute issue response',
  'Pay per order',
];

function GooglePlayIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg"
      alt="Google Play"
      className="h-8 w-8"
      loading="lazy"
      decoding="async"
    />
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 384 512" className="h-8 w-8" aria-hidden="true">
      <path
        fill="#FFFFFF"
        d="M318.7 268.5c-.2-50.3 41.1-74.5 43-75.6-23.5-34.3-60-39-72.9-39.5-31-3.1-60.5 18.3-76.2 18.3-15.8 0-40-17.9-65.8-17.4-33.8 .5-65.1 19.7-82.5 49.8-35.2 61-9 151.2 25.3 200.7 16.8 24.2 36.7 51.3 62.9 50.3 25.2-1 34.7-16.3 65.1-16.3 30.3 0 39 16.3 65.7 15.8 27.2-.5 44.3-24.7 60.9-49 19.3-28.3 27.2-55.7 27.5-57.1-.6-.2-52.7-20.2-52.9-80zm-50.3-148.1c13.9-16.9 23.2-40.4 20.6-63.9-20 .8-44.2 13.3-58.6 30.2-12.8 14.8-24 38.6-21 61.3 22.3 1.8 45.1-11.3 59-27.6z"
      />
    </svg>
  );
}

function MobilePhoneFallback() {
  return (
    <div className="relative mx-auto h-[360px] w-[200px] rounded-[36px] border-4 border-forest-dark bg-forest-dark p-3 shadow-[0_20px_40px_rgba(15,46,42,0.25)]">
      <div className="h-full rounded-[26px] bg-gradient-to-b from-forest-mid via-forest-dark to-[#081E1C] px-5 py-8 text-center">
        <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-gold/50" />
        <p className="font-display text-[30px] font-bold tracking-wide text-gold">RAPIDRY</p>
        <p className="mt-3 font-body text-xs text-cream/80">Laundry Excellence, Delivered</p>
        <div className="mt-8 space-y-3">
          <div className="h-2 w-full rounded-full bg-gold/35" />
          <div className="h-2 w-5/6 rounded-full bg-gold/25" />
          <div className="h-2 w-2/3 rounded-full bg-gold/20" />
        </div>
      </div>
    </div>
  );
}

function StaticPhoneMockup() {
  return (
    <div className="mx-auto h-[520px] w-[260px] rounded-[36px] border-[3px] border-[#333] bg-[#1a1a1a] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#0F2E2A,#183F3A)] text-center">
        <p className="font-display text-[28px] font-bold tracking-wide text-gold">RAPIDRY</p>
        <div className="mt-6 w-4/5 space-y-3">
          <div className="h-2 rounded-full bg-gold/40" />
          <div className="h-2 rounded-full bg-gold/30" />
          <div className="h-2 rounded-full bg-gold/20" />
        </div>
      </div>
    </div>
  );
}

class PhoneMockupBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return <StaticPhoneMockup />;
    }

    return children;
  }
}

function StoreButton({ icon, prefix, title }) {
  return (
    <button
      type="button"
      className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-transparent bg-forest-dark px-4 py-3 text-left transition hover:border-[1.5px] hover:border-gold hover:bg-forest-mid sm:w-auto sm:min-w-[210px]"
    >
      {icon}
      <span>
        <span className="block font-body text-xs text-cream/80">{prefix}</span>
        <span className="block font-body text-base font-semibold text-cream">{title}</span>
      </span>
    </button>
  );
}

export default function AppDownload() {
  const sectionRef = useRef(null);
  const featureRefs = useRef([]);

  useHeaderReveal(sectionRef);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        featureRefs.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
    <section id="download" ref={sectionRef} className="bg-cream py-[60px] text-forest-dark sm:py-[80px] lg:py-[120px]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="order-2 lg:order-1 lg:col-span-5">
          <div className="hidden md:block">
            <PhoneMockupBoundary>
              <Suspense fallback={<StaticPhoneMockup />}>
                <PhoneMockup triggerRef={sectionRef} />
              </Suspense>
            </PhoneMockupBoundary>
          </div>
          <div className="md:hidden">
            <MobilePhoneFallback />
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <h2 className="mt-5 overflow-hidden font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            <span data-reveal="title" className="block">
              Your laundry,<br />
              <span className="italic">professionally managed.</span>
            </span>
          </h2>
          <p data-reveal="subtitle" className="mt-4 max-w-xl font-body text-sm text-forest-dark/70">
            Track every stage, manage payments, and chat with support from one streamlined app.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <div
                key={feature}
                ref={(node) => {
                  featureRefs.current[index] = node;
                }}
                className="flex items-center gap-3"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                  <span className="text-sm">✓</span>
                </span>
                <span className="font-body text-sm text-forest-dark/85">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <StoreButton icon={<GooglePlayIcon />} prefix="Google Play" title="Coming Soon" />
            <StoreButton icon={<AppleIcon />} prefix="App Store" title="Coming Soon" />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-gold/35 bg-white/80">
              <span className="font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-forest-dark/80">Soon</span>
            </div>
            <p className="font-body text-sm text-forest-dark/70">App scanning coming soon</p>
          </div>
        </div>
      </div>
    </section>
  );
}
