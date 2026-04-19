import { Link, useParams } from 'react-router-dom';
import { PortableText } from '@portabletext/react';
import { useCallback, useEffect } from 'react';
import useSanityQuery from '../hooks/useSanityQuery';
import { getAdjacentPosts, getBlogPostBySlug } from '../lib/blogApi';
import { urlFor } from '../lib/sanityClient';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

const portableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
};

function setMetaTag(attribute, key, content) {
  if (!content) {
    return;
  }

  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function BlogPostPage() {
  const { slug } = useParams();

  const loadPost = useCallback((params) => getBlogPostBySlug(params?.slug), []);
  const { data: post, loading, error } = useSanityQuery(loadPost, { slug });

  const loadAdjacentPosts = useCallback((params) => getAdjacentPosts(params?.date), []);
  const { data: adjacentPosts } = useSanityQuery(
    loadAdjacentPosts,
    post?.date ? { date: post.date } : null
  );

  if (loading) {
    return (
      <section className="bg-cream px-4 py-[100px] text-forest-dark sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex h-4 w-28 rounded bg-gold/30 animate-pulse" />

          <article className="mt-6 rounded-3xl border border-gold/30 bg-forest-dark/95 p-7 text-cream shadow-[0_14px_40px_rgba(15,46,42,0.28)] backdrop-blur-sm md:p-10">
            <div className="h-3 w-32 rounded bg-gold/30 animate-pulse" />
            <div className="mt-4 h-14 w-5/6 rounded bg-white/15 animate-pulse" />
            <div className="mt-5 h-4 w-44 rounded bg-white/12 animate-pulse" />
            <div className="mt-7 flex gap-2">
              <div className="h-6 w-24 rounded-full bg-gold/20 animate-pulse" />
              <div className="h-6 w-20 rounded-full bg-gold/20 animate-pulse" />
            </div>
            <div className="mt-8 space-y-4">
              <div className="h-4 w-full rounded bg-white/12 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/12 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-white/12 animate-pulse" />
              <div className="h-4 w-full rounded bg-white/12 animate-pulse" />
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-cream px-4 py-[120px] text-forest-dark sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/25 bg-white/70 p-10 text-center shadow-[0_12px_40px_rgba(15,46,42,0.08)] backdrop-blur-sm">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold">Blog</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight">Unable to load post</h1>
          <p className="mx-auto mt-3 max-w-xl font-body text-base text-forest-dark/72">
            Something went wrong while loading this article. Please refresh and try again.
          </p>
          <Link
            to="/blog"
            className="mt-7 inline-flex rounded-full bg-forest-dark px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.07em] text-gold transition hover:bg-forest-mid"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="bg-cream px-4 py-[120px] text-forest-dark sm:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gold/25 bg-white/70 p-10 text-center shadow-[0_12px_40px_rgba(15,46,42,0.08)] backdrop-blur-sm">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold">Blog</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight">Post not found</h1>
          <p className="mx-auto mt-3 max-w-xl font-body text-base text-forest-dark/72">
            The article you are looking for is not available. You can explore the rest of our care guides from the
            blog page.
          </p>
          <Link
            to="/blog"
            className="mt-7 inline-flex rounded-full bg-forest-dark px-6 py-3 font-body text-sm font-semibold uppercase tracking-[0.07em] text-gold transition hover:bg-forest-mid"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const previousPost = adjacentPosts?.previous ?? null;
  const nextPost = adjacentPosts?.next ?? null;

  useEffect(() => {
    const previousTitle = document.title;

    if (!post) {
      return () => {
        document.title = previousTitle;
      };
    }

    const title = `${post.title} | RAPIDRY Blog`;
    const description = post.excerpt || 'Read expert garment-care insights from RAPIDRY.';
    const image = post.coverImage
      ? urlFor(post.coverImage).width(1200).height(630).fit('crop').auto('format').url()
      : 'https://rapidry.in/IMG_new.png';

    document.title = title;
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);

    return () => {
      document.title = previousTitle;
    };
  }, [post]);

  return (
    <section className="bg-cream px-4 py-[100px] text-forest-dark sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-gold transition hover:text-forest-dark"
        >
          <span aria-hidden="true">←</span>
          Back to Blog
        </Link>

        <article className="mt-6 rounded-3xl border border-gold/30 bg-forest-dark/95 p-7 text-cream shadow-[0_14px_40px_rgba(15,46,42,0.28)] backdrop-blur-sm md:p-10">
          <p className="font-body text-xs font-medium uppercase tracking-[0.2em] text-gold">{post.author}</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-[42px]">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm text-cream/72">
            <span>{formatDate(post.date)}</span>
            <span aria-hidden="true">•</span>
            <span>{post.readTime}</span>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {(post.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.06em] text-gold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="blog-content mt-8 space-y-4 font-body text-[15px] leading-relaxed text-cream/90">
            <PortableText value={post.content ?? []} components={portableTextComponents} />
          </div>
        </article>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {previousPost ? (
            <Link
              to={`/blog/${previousPost.slug}`}
              className="rounded-2xl border border-gold/25 bg-white/65 p-5 backdrop-blur-sm transition hover:bg-white/80"
            >
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">Previous Post</p>
              <p className="mt-2 font-display text-xl text-forest-dark">{previousPost.title}</p>
            </Link>
          ) : (
            <div className="hidden md:block" aria-hidden="true" />
          )}

          {nextPost ? (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="rounded-2xl border border-gold/25 bg-white/65 p-5 text-left backdrop-blur-sm transition hover:bg-white/80"
            >
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">Next Post</p>
              <p className="mt-2 font-display text-xl text-forest-dark">{nextPost.title}</p>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
