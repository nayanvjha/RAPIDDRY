const VARIANT_STYLES = {
  inline: {
    wrapper: 'gap-2 rounded-xl px-2.5 py-1.5',
    image: 'h-7 w-auto sm:h-8',
    text: 'text-[11px] leading-tight sm:text-xs',
  },
  banner: {
    wrapper: 'gap-3 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3',
    image: 'h-10 w-auto sm:h-12 md:h-14',
    text: 'text-xs sm:text-sm md:text-[15px]',
  },
};

const TONE_STYLES = {
  dark: 'border-forest-dark/15 bg-white/70 text-forest-dark shadow-[0_10px_30px_rgba(15,46,42,0.12)]',
  light: 'border-white/25 bg-white/10 text-white shadow-[0_12px_35px_rgba(0,0,0,0.22)]',
};

export default function StartupIndiaBadge({
  variant = 'inline',
  tone = 'dark',
  className = '',
  text = 'Recognised by Startup India',
}) {
  const badgeVariant = VARIANT_STYLES[variant] ?? VARIANT_STYLES.inline;
  const badgeTone = TONE_STYLES[tone] ?? TONE_STYLES.dark;

  return (
    <div
      className={`group inline-flex w-fit items-center border backdrop-blur-md transition duration-300 hover:scale-[1.02] hover:shadow-[0_14px_38px_rgba(214,185,123,0.28)] ${badgeVariant.wrapper} ${badgeTone} ${className}`}
      role="note"
      aria-label={text}
    >
      <img
        src="/assets/startup-india-logo.png"
        alt="DPIIT Startup India Recognition - Recognised by Government of India"
        className={`${badgeVariant.image} shrink-0 object-contain`}
        loading="lazy"
      />
      <p className={`font-body font-semibold tracking-[0.02em] ${badgeVariant.text}`}>{text}</p>
    </div>
  );
}