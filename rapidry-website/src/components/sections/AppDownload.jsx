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
    <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
      <path fill="#34A853" d="M8 8l31 24L8 56z" />
      <path fill="#FBBC05" d="M8 8l25 19 8-7L8 8z" />
      <path fill="#EA4335" d="M8 56l25-19 8 7L8 56z" />
      <path fill="#4285F4" d="M33 27l8 5-8 5-7-5z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden="true">
      <path
        fill="#FFFFFF"
        d="M44 35c0 9-7 19-13 19s-13-10-13-19c0-8 5-14 12-14 7 0 14 6 14 14zm-9-20c2-3 2-7 2-7s-5 1-8 4c-2 2-3 6-3 6s5 1 9-3z"
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
      className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-transparent bg-forest-dark px-4 py-3 text-left transition hover:border-[1.5px] hover:border-gold hover:bg-forest-mid"
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
    <section id="download" ref={sectionRef} className="bg-cream px-6 py-[120px] text-forest-dark">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
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
          <p
            data-reveal="eyebrow"
            className="inline-flex w-fit items-center rounded-full border border-gold/50 bg-gold/10 px-4 py-2 font-body text-sm font-medium text-gold"
          >
            ★★★★★ 4.9 on Play Store
          </p>

          <h2 className="mt-5 overflow-hidden font-display text-4xl font-bold leading-tight md:text-5xl">
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

          <div className="mt-10 flex flex-wrap gap-4">
            <StoreButton icon={<GooglePlayIcon />} prefix="Get it on" title="Google Play" />
            <StoreButton icon={<AppleIcon />} prefix="Download on the" title="App Store" />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-20 w-20 rounded-lg border border-gold/35 bg-white p-2">
              <div className="h-full w-full rounded bg-[linear-gradient(45deg,#0F2E2A_25%,#D6B97B_25%,#D6B97B_50%,#0F2E2A_50%,#0F2E2A_75%,#D6B97B_75%,#D6B97B)] bg-[length:16px_16px]" />
            </div>
            <p className="font-body text-sm text-forest-dark/70">Or scan to download</p>
          </div>
        </div>
      </div>
    </section>
  );
}
