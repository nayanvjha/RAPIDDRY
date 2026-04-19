import { Instagram, Linkedin, Twitter, Heart } from 'lucide-react';
import StartupIndiaBadge from '../StartupIndiaBadge';
import { trackConversion } from '../../utils/gtag';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE, WHATSAPP_DISPLAY_NUMBER } from '../../utils/whatsapp';

const SERVICE_LINKS = ['Wash & Fold', 'Wash & Iron', 'Dry Clean', 'Stain Removal', 'Steam Iron', 'Shoe Care', 'Bag Care'];
const COMPANY_LINKS = [
  { label: 'About', id: 'top' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Coverage', id: 'coverage' },
  { label: 'Careers', href: 'mailto:careers@rapidry.in' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  const y = target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

export default function Footer() {
  const whatsappUrl = buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE);

  return (
    <footer>
      <section className="bg-gold px-4 py-[60px] text-center text-forest-dark sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold sm:text-3xl md:text-[36px]">Ready for premium laundry care?</h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-base text-forest-dark/70">
            Download the app and schedule your first pickup in under 60 seconds.
          </p>
          <button
            type="button"
            onClick={() => scrollToId('download')}
            className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-forest-dark px-8 font-body text-sm font-semibold uppercase tracking-[0.08em] text-gold"
          >
            Download Now
          </button>
        </div>
      </section>

      <section className="bg-forest-dark pb-10 pt-12 text-cream md:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 text-gold">
                <img src="/IMG_new.png" alt="RAPIDRY logo" className="h-7 w-7 object-contain" />
                <span className="font-display text-xl font-bold tracking-[0.14em]">RAPIDRY</span>
              </div>

              <p className="mt-4 max-w-[260px] font-body text-sm leading-relaxed text-cream/50">
                Redefining garment care for the modern professional.
              </p>

              <StartupIndiaBadge variant="inline" tone="light" className="mt-4 max-w-[90vw] scale-90 sm:scale-100" />

              <div className="mt-5 flex items-center gap-4 text-gold">
                <a href="https://www.instagram.com/rapidry.in" target="_blank" rel="noreferrer" className="transition hover:opacity-70" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://linkedin.com/company/rapidry" target="_blank" rel="noreferrer" className="transition hover:opacity-70" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://twitter.com/rapidry" target="_blank" rel="noreferrer" className="transition hover:opacity-70" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-cream">Services</h3>
              <ul className="mt-4 space-y-2">
                {SERVICE_LINKS.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() => scrollToId('services')}
                      className="font-body text-sm text-cream/60 transition hover:text-cream"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-cream">Company</h3>
              <ul className="mt-4 space-y-2">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.id ? (
                      <button
                        type="button"
                        onClick={() => scrollToId(link.id)}
                        className="font-body text-sm text-cream/60 transition hover:text-cream"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href} className="font-body text-sm text-cream/60 transition hover:text-cream">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-cream">Connect</h3>
              <div className="mt-4 space-y-2">
                <a href="mailto:enquiries@rapidry.in" onClick={() => trackConversion('contact')} className="block font-body text-sm text-gold hover:opacity-80">
                  enquiries@rapidry.in
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion('contact')} className="block font-body text-sm text-cream/70 hover:text-cream">
                  WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
                </a>
                <a href="https://www.instagram.com/rapidry.in" target="_blank" rel="noreferrer" className="block font-body text-sm text-cream/70 hover:text-cream">
                  Instagram
                </a>
              </div>

              <p className="mt-5 inline-flex rounded-full border border-gold/45 px-3 py-1.5 font-body text-xs text-gold">
                Launching in Gurgaon, 2026
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-5 text-center md:flex-row md:text-left">
            <p className="font-body text-[13px] text-cream/55">© 2026 RAPIDRY Pvt. Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1 font-body text-[13px] text-cream/40">
              Made with <Heart size={13} className="text-gold" fill="currentColor" /> in Gurgaon
            </p>
          </div>
        </div>
      </section>
    </footer>
  );
}
