import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQ_DATA } from '../../data/brand';
import useHeaderReveal from '../../hooks/useHeaderReveal';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const sectionRef = useRef(null);

  useHeaderReveal(sectionRef);

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section id="faq" ref={sectionRef} className="bg-cream px-6 py-[100px] text-forest-dark">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p data-reveal="eyebrow" className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">
            FAQs
          </p>
          <h2 className="mx-auto mt-4 max-w-[700px] overflow-hidden text-center font-display text-4xl font-bold leading-tight md:text-5xl">
            <span data-reveal="title" className="block">
              Questions answered.
            </span>
          </h2>
          <p data-reveal="subtitle" className="mt-4 font-body text-sm text-forest-dark/70">
            Everything you need to know before your first pickup.
          </p>
        </div>

        <div className="mt-12">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="border-b border-cream-dark py-5">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-body text-base font-semibold text-forest-dark">{item.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>

                <motion.span
                  className="mt-4 block h-[2px] w-full origin-left bg-gold/60"
                  initial={false}
                  animate={{ scaleX: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.35, ease: 'easeOut' }, opacity: { duration: 0.25, ease: 'easeOut', delay: 0.12 } }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 border-l-2 border-gold pl-4 font-body text-[15px] leading-relaxed text-slate-500">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
