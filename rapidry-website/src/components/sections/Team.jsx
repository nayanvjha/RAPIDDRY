import { useLayoutEffect, useRef } from 'react';
import { Globe, Linkedin, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useHeaderReveal from '../../hooks/useHeaderReveal';

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
  {
    id: 'nishant',
    initials: 'NS',
    name: 'Nishant Sarawgi',
    role: 'Founder & CEO',
    bio: 'Started Rapidry after one too many ruined shirts and a broken promise of quality from local laundry options.',
    pills: ['Founder', 'Gurgaon', 'Est. 2026'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'nayan',
    initials: 'NK',
    name: 'Nayan Kumar',
    role: 'Technical Co-Founder',
    bio: 'Cybersecurity engineer and Big 4-trained consultant building the operating brain that keeps every order trackable and trusted.',
    pills: ['BIG 4', 'CYBERSECURITY'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'open-role',
    initials: '+',
    name: 'You?',
    role: 'Open Position',
    bio: 'Looking for driven people who care deeply about building a new standard for personal care infrastructure in India.',
    pills: ['Hiring', 'Operations', 'Growth'],
    email: 'careers@rapidry.in',
  },
];

const VALUES = [
  {
    title: 'Radical Transparency',
    description: 'Live updates, clear timelines, and no hidden process between pickup and delivery.',
    Icon: Globe,
  },
  {
    title: 'Zero Compromise',
    description: 'Every garment is handled with strict quality checkpoints and accountability.',
    Icon: ShieldCheck,
  },
  {
    title: 'Tech-First Care',
    description: 'Automation and intelligence that improve service quality, not replace human care.',
    Icon: Sparkles,
  },
];

export default function Team() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useHeaderReveal(sectionRef);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.15,
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
    <section id="team" ref={sectionRef} className="bg-forest-dark py-[100px] text-cream">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center">
          <p data-reveal="eyebrow" className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">
            THE TEAM
          </p>
          <h2 className="mt-4 overflow-hidden font-display text-3xl font-bold leading-tight text-cream md:text-4xl lg:text-5xl">
            <span data-reveal="title" className="block">
              The people behind Rapidry.
            </span>
          </h2>
          <p data-reveal="subtitle" className="mt-4 font-body text-sm text-cream/70">
            Operators, engineers, and care leads building the new standard.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member, index) => {
            const isOpenRole = member.id === 'open-role';
            return (
              <article
                key={member.id}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border-t-2 border-gold/20 bg-forest-mid p-9 text-center transition duration-300 hover:-translate-y-1.5 hover:border-gold/55"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-gold/25 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[240%] group-hover:opacity-100" />
                <div className="relative mx-auto inline-flex h-[100px] w-[100px] items-center justify-center rounded-full border-[2.5px] border-gold text-gold md:h-[140px] md:w-[140px]">
                  <span className="pointer-events-none absolute -inset-3 rounded-full border border-gold/20 opacity-60 animate-[pulse_4s_ease-in-out_infinite]" />
                  {isOpenRole ? (
                    <Plus size={32} className="animate-[spin_8s_linear_infinite] transition group-hover:animate-[spin_2.5s_linear_infinite] md:h-[42px] md:w-[42px]" />
                  ) : (
                    <span className="relative font-display text-[30px] font-bold md:text-[40px]">
                      <span className="pointer-events-none absolute inset-0 rounded-full border border-gold/40 opacity-0 blur-md transition duration-500 group-hover:opacity-100" />
                      {member.initials}
                    </span>
                  )}
                </div>

                <h3 className="mt-6 font-display text-[22px] font-semibold text-cream">{member.name}</h3>
                <p className="mt-2 font-body text-xs uppercase tracking-[0.16em] text-gold">{member.role}</p>
                <p className="mt-5 font-body text-sm leading-relaxed text-cream/65">{member.bio}</p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {member.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-gold/35 bg-[rgba(15,46,42,0.7)] px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.06em] text-gold"
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  {isOpenRole ? (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center justify-center rounded-full border border-gold/40 px-5 py-2 font-body text-sm font-medium text-gold transition hover:bg-gold hover:text-forest-dark"
                    >
                      View Openings
                    </a>
                  ) : (
                    <a
                      href={member.linkedin}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-forest-dark"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {VALUES.map((value) => {
            const Icon = value.Icon;
            return (
              <div key={value.title} className="rounded-2xl border border-gold/15 bg-[rgba(24,63,58,0.75)] p-5 text-center">
                <Icon size={24} className="mx-auto text-gold" />
                <h4 className="mt-3 font-display text-xl font-semibold text-cream">{value.title}</h4>
                <p className="mt-2 font-body text-sm text-cream/70">{value.description}</p>
              </div>
            );
          })}
        </div>

        <div className="relative mx-auto mt-12 max-w-[680px] rounded-2xl border border-gold/20 bg-[rgba(24,63,58,0.8)] p-5 text-center md:p-8">
          <span className="pointer-events-none absolute left-5 top-1 font-display text-7xl text-gold/20">“</span>
          <p className="font-display text-[16px] italic leading-relaxed text-cream/90 md:text-[19px]">
            Rapidry began with two frustrations: broken trust and inconsistent care. We built this company so that every pickup
            feels dependable and every delivery feels premium, every single time.
          </p>
          <p className="mt-4 font-body text-sm font-semibold uppercase tracking-[0.08em] text-gold">— Nishant & Nayan, Founders</p>
        </div>
      </div>
    </section>
  );
}
