import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import useHeaderReveal from '../../hooks/useHeaderReveal';

const SERVICE_CONFIG = [
  {
    key: 'washFold',
    label: 'Wash & Fold',
    items: [
      { name: 'Shirt', price: 35 },
      { name: 'T-Shirt', price: 30 },
      { name: 'Trouser', price: 40 },
      { name: 'Saree', price: 80 },
      { name: 'Kurta', price: 50 },
      { name: 'Bedsheet', price: 60 },
    ],
  },
  {
    key: 'washIron',
    label: 'Wash & Iron',
    items: [
      { name: 'Shirt', price: 45 },
      { name: 'T-Shirt', price: 40 },
      { name: 'Trouser', price: 55 },
      { name: 'Kurta', price: 50 },
      { name: 'Saree', price: 80 },
      { name: 'Jeans', price: 65 },
    ],
  },
  {
    key: 'dryClean',
    label: 'Dry Clean',
    items: [
      { name: 'Blazer', price: 299 },
      { name: 'Suit', price: 499 },
      { name: 'Silk Saree', price: 399 },
      { name: 'Coat', price: 349 },
      { name: 'Dress', price: 249 },
    ],
  },
  {
    key: 'steamIron',
    label: 'Steam Iron',
    items: [
      { name: 'Shirt', price: 29 },
      { name: 'T-Shirt', price: 25 },
      { name: 'Trouser', price: 35 },
      { name: 'Saree', price: 45 },
      { name: 'Kurta', price: 30 },
    ],
  },
  {
    key: 'shoe',
    label: 'Shoe Care',
    items: [
      { name: 'Sneakers', price: 149 },
      { name: 'Formal', price: 129 },
      { name: 'Boots', price: 199 },
    ],
  },
  {
    key: 'bag',
    label: 'Bag Care',
    items: [
      { name: 'Handbag', price: 249 },
      { name: 'Backpack', price: 199 },
      { name: 'Laptop Bag', price: 249 },
    ],
  },
];

const formatMoney = (value) => `\u20b9${Math.round(value).toLocaleString('en-IN')}`;

function buildDateLabel(daysToAdd) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function PriceCalculator() {
  const [activeService, setActiveService] = useState(SERVICE_CONFIG[0].key);
  const [quantities, setQuantities] = useState({});
  const [displayTotal, setDisplayTotal] = useState(0);
  const totalRef = useRef(0);
  const ctaRef = useRef(null);
  const sectionRef = useRef(null);

  useHeaderReveal(sectionRef);

  const selectedService = useMemo(
    () => SERVICE_CONFIG.find((service) => service.key === activeService) ?? SERVICE_CONFIG[0],
    [activeService]
  );

  const grandTotal = useMemo(() => {
    let total = 0;
    Object.entries(quantities).forEach(([compoundKey, qty]) => {
      if (!qty) {
        return;
      }

      const [serviceKey, itemName] = compoundKey.split('__');
      const service = SERVICE_CONFIG.find((entry) => entry.key === serviceKey);
      const item = service?.items.find((entry) => entry.name === itemName);
      if (item) {
        total += item.price * qty;
      }
    });
    return total;
  }, [quantities]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      totalRef.current = grandTotal;
      setDisplayTotal(grandTotal);
      return undefined;
    }

    const tweenProxy = { value: totalRef.current };
    const tween = gsap.to(tweenProxy, {
      value: grandTotal,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: () => setDisplayTotal(tweenProxy.value),
      onComplete: () => {
        totalRef.current = grandTotal;
      },
    });

    return () => tween.kill();
  }, [grandTotal]);

  useEffect(() => {
    if (!ctaRef.current) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ctaRef.current.style.opacity = grandTotal > 0 ? '1' : '0';
      ctaRef.current.style.transform = grandTotal > 0 ? 'translateY(0px)' : 'translateY(18px)';
      return;
    }

    if (grandTotal > 0) {
      gsap.to(ctaRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: 'power3.out',
      });
      return;
    }

    gsap.to(ctaRef.current, {
      y: 18,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
    });
  }, [grandTotal]);

  const pickupEstimate = buildDateLabel(1);
  const savings = grandTotal > 200 ? Math.round(grandTotal * 0.15) : 0;

  const itemQuantity = (serviceKey, itemName) => quantities[`${serviceKey}__${itemName}`] ?? 0;

  const updateQty = (serviceKey, itemName, nextQty) => {
    const clampedQty = Math.max(0, nextQty);
    const key = `${serviceKey}__${itemName}`;

    setQuantities((current) => {
      if (clampedQty === 0) {
        const draft = { ...current };
        delete draft[key];
        return draft;
      }
      return { ...current, [key]: clampedQty };
    });
  };

  return (
    <section id="calculator" ref={sectionRef} className="bg-forest-dark py-[100px] text-cream">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p data-reveal="eyebrow" className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">
            INSTANT ESTIMATE
          </p>
          <h2 className="mt-4 overflow-hidden font-display text-4xl font-bold leading-tight text-cream md:text-5xl">
            <span data-reveal="title" className="block">
              What will your order cost?
            </span>
          </h2>
          <p data-reveal="subtitle" className="mx-auto mt-4 max-w-xl font-body text-sm md:text-base text-cream/65">
            Pick your service, set quantities, and watch your estimate update instantly before booking.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[720px] rounded-3xl border border-gold/15 bg-[rgba(243,239,230,0.06)] p-4 backdrop-blur-[20px] md:p-6 lg:p-10">
          <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-2 [scrollbar-width:none]" style={{ WebkitOverflowScrolling: 'touch' }}>
            {SERVICE_CONFIG.map((service) => {
              const isActive = service.key === activeService;
              return (
                <button
                  key={service.key}
                  type="button"
                  onClick={() => setActiveService(service.key)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'border-gold bg-gold text-forest-dark'
                      : 'border-gold/30 bg-transparent text-cream/70 hover:border-gold/60 hover:text-cream'
                  }`}
                >
                  {service.label}
                </button>
              );
            })}
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {selectedService.items.map((item) => {
              const qty = itemQuantity(selectedService.key, item.name);
              return (
                <article
                  key={`${selectedService.key}-${item.name}`}
                  className="rounded-2xl border border-gold/35 bg-[rgba(15,46,42,0.52)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-body text-base font-medium text-cream">{item.name}</p>
                      <p className="mt-1 font-body text-sm text-gold">{formatMoney(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name}`}
                        className="h-8 w-8 rounded-full border border-gold/70 text-gold transition hover:bg-gold hover:text-forest-dark"
                        onClick={() => updateQty(selectedService.key, item.name, qty - 1)}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-body text-sm text-cream">{qty}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name}`}
                        className="h-8 w-8 rounded-full border border-gold/70 text-gold transition hover:bg-gold hover:text-forest-dark"
                        onClick={() => updateQty(selectedService.key, item.name, qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border-t border-gold/20 pt-8 text-center">
            <p className="font-body text-sm uppercase tracking-[0.16em] text-cream/70">Estimated total</p>
            <p className="mt-2 font-display text-4xl font-bold leading-none text-gold md:text-5xl lg:text-6xl">{formatMoney(displayTotal)}</p>

            <p className="mt-4 font-body text-sm text-cream/70">
              Pickup by {pickupEstimate} • Delivered in 4 hrs
            </p>

            {savings > 0 && (
              <p className="mx-auto mt-5 w-fit rounded-full border border-gold/40 bg-gold/15 px-4 py-2 font-body text-sm text-gold">
                You save {formatMoney(savings)} vs market rate
              </p>
            )}

            <button
              ref={ctaRef}
              type="button"
              className="mt-7 rounded-full bg-gold px-8 py-3 font-body text-sm font-semibold uppercase tracking-[0.08em] text-forest-dark opacity-0"
              style={{ transform: 'translateY(18px)' }}
            >
              Book This Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
