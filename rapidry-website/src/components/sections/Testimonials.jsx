export default function Testimonials() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-forest-dark py-[80px] text-cream">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,185,123,0.14),transparent_48%)]" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">REVIEWS</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-cream md:text-4xl lg:text-5xl">Reviews Coming Soon</h2>
          <p className="mx-auto mt-4 max-w-2xl font-body text-sm md:text-base text-cream/70">
            We are currently collecting early customer experiences from our first Rapidry batches in Gurgaon.
            Verified ratings and detailed reviews will be published here shortly.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gold/20 bg-[rgba(24,63,58,0.7)] p-5 text-center backdrop-blur-[12px] md:p-8">
          <p className="font-display text-[20px] italic leading-relaxed text-cream/90">
            Premium service first. Public reviews next.
          </p>
          <p className="mt-3 font-body text-sm text-gold/90">Thank you for your trust while we launch.</p>
        </div>
      </div>
    </section>
  );
}
