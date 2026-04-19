import { Link } from 'react-router-dom';
import { useCallback } from 'react';
import useSanityQuery from '../hooks/useSanityQuery';
import { getAllBlogPosts } from '../lib/blogApi';
import { urlFor } from '../lib/sanityClient';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

export default function BlogPage() {
  const loadPosts = useCallback(() => getAllBlogPosts(), []);
  const { data: posts, loading, error } = useSanityQuery(loadPosts);

  const blogPosts = posts ?? [];

  return (
    <section className="bg-cream py-[110px] text-forest-dark">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <p className="font-body text-xs font-medium uppercase tracking-[0.24em] text-gold">BLOG</p>
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Insights &amp; care tips from RAPIDRY
          </h1>
          <p className="mx-auto mt-5 max-w-3xl font-body text-base text-forest-dark/72">
            Practical clothing-care advice from our operations and garment-care team, written for busy households and
            professionals.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <article
                key={`blog-skeleton-${index}`}
                className="flex h-full flex-col rounded-3xl border border-gold/30 bg-forest-dark/95 p-4 text-cream shadow-[0_14px_40px_rgba(15,46,42,0.28)] backdrop-blur-sm sm:p-6"
              >
                <div className="h-40 w-full rounded-2xl bg-white/10 animate-pulse" />
                <div className="mt-5 h-3 w-40 rounded bg-white/15 animate-pulse" />
                <div className="mt-4 h-8 w-5/6 rounded bg-white/15 animate-pulse" />
                <div className="mt-3 h-14 w-full rounded bg-white/10 animate-pulse" />
                <div className="mt-5 flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-gold/20 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-gold/20 animate-pulse" />
                </div>
                <div className="mt-7 h-4 w-28 rounded bg-gold/25 animate-pulse" />
              </article>
            ))}

          {!loading && error && (
            <div className="rounded-3xl border border-gold/30 bg-forest-dark/95 p-6 text-cream shadow-[0_14px_40px_rgba(15,46,42,0.28)] backdrop-blur-sm sm:p-7 lg:col-span-3">
              <p className="font-body text-sm leading-relaxed text-cream/85">
                We could not load blog posts right now. Please refresh the page in a moment.
              </p>
            </div>
          )}

          {!loading && !error && blogPosts.length === 0 && (
            <div className="rounded-3xl border border-gold/30 bg-forest-dark/95 p-6 text-cream shadow-[0_14px_40px_rgba(15,46,42,0.28)] backdrop-blur-sm sm:p-7 lg:col-span-3">
              <p className="font-body text-sm leading-relaxed text-cream/85">
                No posts yet. New care tips and updates will appear here soon.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            blogPosts.map((post) => (
              <article
                key={post.id}
                className="flex h-full flex-col rounded-3xl border border-gold/30 bg-forest-dark/95 p-4 text-cream shadow-[0_14px_40px_rgba(15,46,42,0.28)] backdrop-blur-sm sm:p-6"
              >
                {post.coverImage ? (
                  <img
                    src={urlFor(post.coverImage).width(1200).height(700).fit('crop').auto('format').url()}
                    alt={post.title}
                    className="h-40 w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                ) : null}

                <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-cream/70 ${post.coverImage ? 'mt-5' : ''}`}>
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden="true">•</span>
                  <span>{post.readTime}</span>
                </div>

                <h2 className="mt-4 font-display text-[22px] leading-tight text-white md:text-[26px]">{post.title}</h2>

                <p className="mt-3 font-body text-sm leading-relaxed text-cream/78">{post.excerpt}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.06em] text-gold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-7 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.07em] text-gold transition hover:text-white"
                >
                  Read More
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}