import { Link, useParams } from 'react-router-dom';
import { BLOG_POSTS } from '../data/blog';

function formatDate(dateString) {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function markdownToHtml(markdown) {
  if (!markdown) {
    return '';
  }

  let html = markdown.replace(/\r\n/g, '\n');

  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  const blocks = html
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('<h1>') || block.startsWith('<h2>') || block.startsWith('<h3>') || block.startsWith('<p>')) {
        return block;
      }

      if (block.includes('\n')) {
        const lines = block
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.every((line) => line.startsWith('- ') || line.startsWith('* '))) {
          const items = lines
            .map((line) => `<li>${line.replace(/^[-*]\s+/, '')}</li>`)
            .join('');
          return `<ul>${items}</ul>`;
        }

        return `<p>${lines.join(' ')}</p>`;
      }

      return `<p>${block}</p>`;
    });

  return blocks.join('');
}

function getRenderableHtml(content) {
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content);
  return hasHtmlTags ? content : markdownToHtml(content);
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const postIndex = BLOG_POSTS.findIndex((item) => item.slug === slug);
  const post = postIndex >= 0 ? BLOG_POSTS[postIndex] : null;

  if (!post) {
    return (
      <section className="bg-cream px-6 py-[120px] text-forest-dark">
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

  const previousPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;
  const renderedHtml = getRenderableHtml(post.content);

  return (
    <section className="bg-cream px-6 py-[100px] text-forest-dark">
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
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.06em] text-gold"
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className="blog-content mt-8 space-y-4 font-body text-[15px] leading-relaxed text-cream/90"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
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
