import { useRef } from 'react';
import { Gift, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useHeaderReveal from '../../hooks/useHeaderReveal';

const SECTORS = ['Sector 29', 'Sector 31', 'Sector 43', 'Sector 44', 'Sector 47', 'Sector 56', 'Sector 57', 'Sector 66'];

export default function WaitlistOffer() {
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      sector: '',
    },
  });

  const onSubmit = (data) => {
    console.log('waitlist-claim', {
      data,
      emailjsServiceId,
      emailjsTemplateId,
      emailjsPublicKey,
    });
    reset();
  };

  const sectionRef = useRef(null);

  useHeaderReveal(sectionRef);

  return (
    <section id="waitlist" ref={sectionRef} className="bg-forest-dark py-[100px] text-cream">
      <div className="mx-auto max-w-[680px] rounded-3xl border border-gold/35 bg-[rgba(243,239,230,0.06)] p-5 backdrop-blur-[16px] md:p-7 lg:p-10">
        <div data-reveal="eyebrow" className="flex items-center justify-center gap-3 text-gold">
          <Gift size={20} />
          <span className="rounded-full border border-gold/40 px-3 py-1 font-body text-xs font-semibold uppercase tracking-[0.1em]">
            Early Member Offer
          </span>
        </div>

        <h2 className="mx-auto mt-6 max-w-xl overflow-hidden text-center font-display text-3xl font-bold leading-tight text-cream md:text-4xl lg:text-[42px]">
          <span data-reveal="title" className="block">
            50% off on your first order.
          </span>
        </h2>
        <p data-reveal="subtitle" className="mt-4 text-center font-body text-sm text-cream/70">
          Exclusive discount for early members in Gurugram.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                  value: /^[0-9]{10}$/,
                  message: 'Enter a valid 10-digit phone number',
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
            className="h-14 w-full rounded-full bg-gold font-body text-sm font-semibold uppercase tracking-[0.08em] text-forest-dark transition hover:brightness-95"
          >
            Claim My Spot
          </button>
        </form>

        {isSubmitSuccessful && (
          <div className="mt-5 flex items-center justify-center gap-2 text-emerald-300">
            <CheckCircle2 size={18} />
            <p className="font-body text-sm font-medium">You're on the list!</p>
          </div>
        )}
      </div>
    </section>
  );
}
