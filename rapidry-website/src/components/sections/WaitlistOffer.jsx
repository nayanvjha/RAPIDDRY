import { useEffect, useRef, useState } from 'react';
import { Gift, CheckCircle2, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { trackConversion } from '../../utils/gtag';

const SECTORS = ['Sector 29', 'Sector 31', 'Sector 43', 'Sector 44', 'Sector 47', 'Sector 56', 'Sector 57', 'Sector 66'];
const CLAIMED_STORAGE_KEY = 'rapidry_offer_claimed';
const DISMISSED_STORAGE_KEY = 'rapidry_popup_dismissed';
const MIN_SUBMIT_DELAY_MS = 1500;
const DEFAULT_FORM_ENDPOINT = 'https://formspree.io/f/xdaynpgv';
const MODAL_DELAY_MS = 3000;

function normalizeIndianMobile(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

async function submitViaEmailJs(data, { emailjsServiceId, emailjsTemplateId, emailjsPublicKey }) {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsPublicKey,
      template_params: {
        name: data.name,
        phone: data.phone,
        sector: data.sector,
        source: data.source,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('EmailJS request failed');
  }
}

async function submitViaEndpoint(data, { formEndpoint, endpointToken }) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (endpointToken) {
    headers.Authorization = `Bearer ${endpointToken}`;
  }

  const response = await fetch(formEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      name: data.name,
      phone: data.phone,
      sector: data.sector,
      source: data.source,
      submitted_at: new Date().toISOString(),
      page_url: typeof window === 'undefined' ? '' : window.location.href,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Form endpoint request failed: ${errorText}`);
  }
}

function OfferCard({ submitConfig, source, onClaimSuccess }) {
  const [submitStatus, setSubmitStatus] = useState('idle');
  const mountedAtRef = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      sector: '',
      company: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitStatus('submitting');

      // Basic anti-bot guard.
      if (data.company) {
        setSubmitStatus('success');
        if (typeof window !== 'undefined') {
          localStorage.setItem(CLAIMED_STORAGE_KEY, 'true');
        }
        onClaimSuccess?.();
        return;
      }

      if (Date.now() - mountedAtRef.current < MIN_SUBMIT_DELAY_MS) {
        setSubmitStatus('error');
        return;
      }

      const normalizedPhone = normalizeIndianMobile(data.phone);
      if (!/^[6-9][0-9]{9}$/.test(normalizedPhone)) {
        setError('phone', {
          type: 'validate',
          message: 'Enter a valid Indian mobile number',
        });
        setSubmitStatus('idle');
        return;
      }

      const payload = {
        ...data,
        phone: normalizedPhone,
        source,
      };

      if (submitConfig.formEndpoint) {
        await submitViaEndpoint(payload, submitConfig);
      } else if (submitConfig.emailjsServiceId && submitConfig.emailjsTemplateId && submitConfig.emailjsPublicKey) {
        await submitViaEmailJs(payload, submitConfig);
      } else {
        throw new Error('No form service configured. Set VITE_WAITLIST_FORM_ENDPOINT or EmailJS variables.');
      }

      setSubmitStatus('success');
      trackConversion('lead_form');
      reset();
      if (typeof window !== 'undefined') {
        localStorage.setItem(CLAIMED_STORAGE_KEY, 'true');
      }
      onClaimSuccess?.();
    } catch (error) {
      setSubmitStatus('error');
      console.error('waitlist-submit-failed', error);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-gold/35 bg-[rgba(15,46,42,0.96)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-[16px] md:p-7 lg:p-10">
      <div className="flex items-center justify-center gap-3 text-gold">
        <Gift size={20} />
        <span className="rounded-full border border-gold/40 px-3 py-1 font-body text-xs font-semibold uppercase tracking-[0.1em]">
          Early Member Offer
        </span>
      </div>

      <h2 className="mx-auto mt-6 max-w-xl overflow-hidden text-center font-display text-3xl font-bold leading-tight text-cream md:text-4xl lg:text-[42px]">
        <span className="block">
          50% off on your first order.
        </span>
      </h2>
      <p className="mt-4 text-center font-body text-sm text-cream/70">
        Exclusive discount for early members in Gurugram.
      </p>

      {submitStatus === 'success' ? (
        <div className="mt-8 rounded-2xl border border-emerald-400/45 bg-emerald-500/12 p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-300">
            <CheckCircle2 size={18} />
            <p className="font-body text-sm font-semibold">Thanks! We&apos;ve reserved your 50% off spot. We&apos;ll reach out shortly on WhatsApp.</p>
          </div>
        </div>
      ) : (
        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            aria-hidden="true"
            {...register('company')}
          />

          <div>
            <input
              type="text"
              placeholder="Your name"
              className="h-12 w-full rounded-xl border border-gold/35 bg-[rgba(15,46,42,0.68)] px-4 font-body text-sm text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-300">{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone number"
              className="h-12 w-full rounded-xl border border-gold/35 bg-[rgba(15,46,42,0.68)] px-4 font-body text-sm text-cream placeholder:text-cream/45 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
              {...register('phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^[+]?([0-9\s()-]{10,16})$/,
                  message: 'Enter a valid phone number',
                },
              })}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p>}
          </div>

          <div>
            <select
              className="h-12 w-full rounded-xl border border-gold/35 bg-[rgba(15,46,42,0.68)] px-4 font-body text-sm text-cream focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/35"
              {...register('sector', { required: 'Please select a sector' })}
            >
              <option value="" className="text-forest-dark">
                Select your sector
              </option>
              {SECTORS.map((sector) => (
                <option key={sector} value={sector} className="text-forest-dark">
                  {sector}
                </option>
              ))}
            </select>
            {errors.sector && <p className="mt-1 text-xs text-red-300">{errors.sector.message}</p>}
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'submitting'}
            className="h-14 w-full rounded-full bg-gold font-body text-sm font-semibold uppercase tracking-[0.08em] text-forest-dark transition hover:brightness-95"
          >
            {submitStatus === 'submitting' ? 'Submitting...' : 'Claim My Spot'}
          </button>
        </form>
      )}

      {submitStatus === 'error' && (
        <div className="mt-5 rounded-xl border border-red-300/45 bg-red-500/10 p-3 text-center">
          <p className="font-body text-sm text-red-200">
            Could not submit right now. Please try again in a moment.
          </p>
        </div>
      )}
    </div>
  );
}

export default function WaitlistOffer() {
  const formEndpoint = import.meta.env.VITE_WAITLIST_FORM_ENDPOINT || DEFAULT_FORM_ENDPOINT;
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const endpointToken = import.meta.env.VITE_WAITLIST_FORM_BEARER_TOKEN;
  const [isOpen, setIsOpen] = useState(false);

  const submitConfig = {
    formEndpoint,
    endpointToken,
    emailjsServiceId,
    emailjsTemplateId,
    emailjsPublicKey,
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const alreadyClaimed = localStorage.getItem(CLAIMED_STORAGE_KEY) === 'true';
    const dismissedInSession = sessionStorage.getItem(DISMISSED_STORAGE_KEY) === 'true';
    if (alreadyClaimed || dismissedInSession) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, MODAL_DELAY_MS);

    const onMouseLeave = (event) => {
      if (event.clientY <= 0) {
        setIsOpen(true);
      }
    };

    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const closeModal = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
      sessionStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
    }
  };

  const handleClaimSuccess = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CLAIMED_STORAGE_KEY, 'true');
      sessionStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
    }
    setIsOpen(false);
  };

  return (
    <>
      <section id="waitlist" className="bg-forest-dark py-[100px] text-cream">
        <div className="mx-auto max-w-[680px] px-4 md:px-6">
          <OfferCard submitConfig={submitConfig} source="Website Waitlist Section" onClaimSuccess={handleClaimSuccess} />
        </div>
      </section>

      {isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center px-4 py-8 text-cream">
          <button
            type="button"
            aria-label="Close waitlist popup"
            className="absolute inset-0 bg-[rgba(0,0,0,0.62)] backdrop-blur-[2px]"
            onClick={closeModal}
          />

          <div className="relative z-10 w-full max-w-[680px]">
            <button
              type="button"
              aria-label="Close"
              className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/45 text-gold transition hover:bg-gold hover:text-forest-dark"
              onClick={closeModal}
            >
              <X size={16} />
            </button>
            <OfferCard submitConfig={submitConfig} source="Website Waitlist Modal" onClaimSuccess={handleClaimSuccess} />
          </div>
        </div>
      )}
    </>
  );
}
