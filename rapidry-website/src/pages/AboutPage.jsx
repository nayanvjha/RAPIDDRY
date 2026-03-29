import StartupIndiaBadge from '../components/StartupIndiaBadge';
import Team from '../components/sections/Team';

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream py-[110px] text-forest-dark">
        <div className="mx-auto max-w-5xl px-4 text-center md:px-6">
          <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">ABOUT US</p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Redefining garment care for the modern professional.
          </h1>
          <p className="mx-auto mt-5 max-w-3xl font-body text-base leading-relaxed text-forest-dark/75">
            Rapidry was founded in 2026 to bring premium, accountable laundry care to Gurgaon through a modern
            pickup-to-delivery experience. Our mission is simple: every order should feel fast, transparent, and
            consistently high quality. We are recognised by Startup India under DPIIT, and we are building garment
            care infrastructure people can truly trust.
          </p>

          <div className="mt-8 flex justify-center">
            <StartupIndiaBadge variant="banner" tone="dark" text="Recognised by Startup India | DPIIT Certified" />
          </div>
        </div>
      </section>

      <Team />

      <section className="bg-cream pb-[120px] pt-[70px] text-forest-dark">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/25 bg-white/65 p-5 text-center shadow-[0_12px_40px_rgba(15,46,42,0.08)] backdrop-blur-sm md:p-9 lg:p-12">
          <p className="font-body text-xs font-medium uppercase tracking-[0.22em] text-gold">Careers</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl lg:text-[40px]">Join Us</h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-forest-dark/72">
            We are building the next standard for premium garment care and logistics. If you are excited to help shape
            what Rapidry becomes, we would love to hear from you.
          </p>

          <a
            href="mailto:careers@rapidry.in"
            className="mt-8 inline-flex rounded-full bg-forest-dark px-7 py-3 font-body text-sm font-semibold uppercase tracking-[0.08em] text-gold transition hover:bg-forest-mid"
          >
            careers@rapidry.in
          </a>
        </div>
      </section>
    </>
  );
}