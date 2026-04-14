import StartupIndiaBadge from '../components/StartupIndiaBadge';
import Team from '../components/sections/Team';

export default function AboutPage() {
  return (
    <>
      <section className="bg-cream py-[110px] text-forest-dark">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">OUR STORY</p>
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Born from a ruined shirt and a broken promise.
          </h1>

          <div className="mx-auto mt-8 max-w-3xl space-y-5 text-left font-body text-base leading-relaxed text-forest-dark/80">
            <p>
              It started with a ₹4,200 shirt.
            </p>
            <p>
              Nishant had just moved to Gurgaon for work, a new city, a new job, and no time. He handed his
              best office shirt to the neighbourhood laundry guy, the one everyone on the street
              recommended. Three days later, it came back with iron burns across the collar and a
              missing button. When he went back to ask, the response was a shrug: <em>"Hota hai, sahab."</em>
            </p>
            <p>
              No receipt. No tracking. No accountability. Just a ruined shirt and a ₹200 refund
              "for the inconvenience."
            </p>
            <p>
              That evening, Nishant looked around and realized this was not just his problem. It was
              everyone's. His flatmate had lost a pair of trousers. A colleague had a kurta returned
              with someone else's stains. A friend had been waiting five days for ironing that was
              promised in two. And yet, nobody switched because every option felt equally broken.
            </p>
            <p>
              That's when RAPIDRY was born. Not in a boardroom, not from a pitch deck, but from
              genuine frustration, standing in a 6x4 laundry shop in Sector 49, holding a burnt shirt,
              thinking: <em>"There has to be a better way."</em>
            </p>
            <p>
              Nishant called up Nayan, his friend and now cofounder, and together they set out to
              build the laundry service they wished existed. One where every garment is tagged and
              tracked from pickup to delivery. Where ironed clothes can reach you in as little as
              40 minutes. Where if something goes wrong, and they work hard to make sure it
              does not, there is real accountability, not a shrug and ₹200.
            </p>
            <p>
              Today, RAPIDRY serves professionals across Gurgaon with express 3 hour delivery,
              real time order tracking, and premium garment care, all powered by a system built from
              scratch to make sure no one else has to go through what Nishant did.
            </p>
            <p className="font-semibold text-forest-dark">
              Your clothes deserve better. And honestly? So do you.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <StartupIndiaBadge variant="banner" tone="dark" text="Recognised by Startup India | DPIIT Certified" />
          </div>
        </div>
      </section>

      <Team />

      <section className="bg-cream pb-[120px] pt-[70px] text-forest-dark">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/25 bg-white/65 p-5 text-center shadow-[0_12px_40px_rgba(15,46,42,0.08)] backdrop-blur-sm md:p-9 lg:p-12">
          <p className="font-body text-xs font-medium uppercase tracking-[0.22em] text-gold">Careers</p>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-[40px]">Join Us</h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base text-forest-dark/72">
            We are building the next standard for premium garment care and logistics. If you are excited to help shape
            what RAPIDRY becomes, we would love to hear from you.
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