export default function Testimonials() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-forest-dark py-[80px] text-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,185,123,0.14),transparent_48%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">REVIEWS</p>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-cream sm:text-3xl md:text-4xl lg:text-5xl">Reviews Coming Soon</h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-sm md:text-base text-cream/70">
            We are currently collecting early customer experiences from our first RAPIDRY batches in Gurgaon.
            Verified ratings and detailed reviews will be published here shortly.
          </p>
        </div>

        <div className="relative mx-auto mt-10 w-[280px] max-w-3xl rounded-2xl border border-gold/20 bg-[rgba(24,63,58,0.7)] p-5 text-center backdrop-blur-[12px] sm:w-[340px] sm:p-7 md:w-[380px]">
          <span className="pointer-events-none absolute left-3 top-0 font-display text-[80px] leading-none text-gold/20 sm:text-[120px] md:text-[160px]">&ldquo;</span>
          <p className="relative z-10 font-display text-[14px] italic leading-relaxed text-cream/90 sm:text-[16px]">
            Premium service first. Public reviews next.
          </p>
          <p className="mt-3 font-body text-xs text-gold/90 sm:text-sm">Thank you for your trust while we launch.</p>
        </div>
      </div>
    </section>
  );
}
