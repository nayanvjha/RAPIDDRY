import { createClient } from '@sanity/client';
import { BLOG_POSTS } from '../src/data/blog.js';

const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_AUTH_TOKEN;

const sanityClient = createClient({
  projectId: 'qrn7u0wh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
});

function key() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
}

function createSpan(text, marks = []) {
  return {
    _type: 'span',
    _key: key(),
    text,
    marks,
  };
}

function createBlock(style, children, extras = {}) {
  return {
    _type: 'block',
    _key: key(),
    style,
    markDefs: [],
    children: children.length ? children : [createSpan('')],
    ...extras,
  };
}

function inlineToChildren(text) {
  const input = (text || '').replace(/\s+/g, ' ').trim();
  if (!input) {
    return [createSpan('')];
  }

  const children = [];
  const tokenPattern = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;
  let match;

  while ((match = tokenPattern.exec(input)) !== null) {
    if (match.index > lastIndex) {
      children.push(createSpan(input.slice(lastIndex, match.index)));
    }

    const token = match[0];
    if (token.startsWith('**') || token.startsWith('__')) {
      children.push(createSpan(token.slice(2, -2), ['strong']));
    } else {
      children.push(createSpan(token.slice(1, -1), ['em']));
    }

    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < input.length) {
    children.push(createSpan(input.slice(lastIndex)));
  }

  return children;
}

function markdownToPortableText(markdown) {
  const blocks = [];
  const lines = (markdown || '').replace(/\r\n/g, '\n').split('\n');
  let paragraphLines = [];

  const flushParagraph = () => {
    const text = paragraphLines.join(' ').replace(/\s+/g, ' ').trim();
    if (text) {
      blocks.push(createBlock('normal', inlineToChildren(text)));
    }
    paragraphLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push(createBlock('h3', inlineToChildren(line.slice(4))));
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      blocks.push(createBlock('h2', inlineToChildren(line.slice(3))));
      continue;
    }

    const listMatch = line.match(/^([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      flushParagraph();
      blocks.push(
        createBlock('normal', inlineToChildren(listMatch[2]), {
          listItem: 'bullet',
          level: 1,
        })
      );
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  return blocks;
}

function stripTags(html) {
  return html
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlToPortableText(html) {
  const blocks = [];
  const source = (html || '').trim();
  const tokenPattern = /<(h2|h3|p|ul)[^>]*>[\s\S]*?<\/\1>/gi;

  let match;
  while ((match = tokenPattern.exec(source)) !== null) {
    const fullTag = match[0];
    const tag = match[1].toLowerCase();

    if (tag === 'h2') {
      blocks.push(createBlock('h2', inlineToChildren(stripTags(fullTag))));
      continue;
    }

    if (tag === 'h3') {
      blocks.push(createBlock('h3', inlineToChildren(stripTags(fullTag))));
      continue;
    }

    if (tag === 'p') {
      blocks.push(createBlock('normal', inlineToChildren(stripTags(fullTag))));
      continue;
    }

    if (tag === 'ul') {
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch;
      while ((liMatch = liPattern.exec(fullTag)) !== null) {
        const liText = stripTags(liMatch[1]);
        blocks.push(
          createBlock('normal', inlineToChildren(liText), {
            listItem: 'bullet',
            level: 1,
          })
        );
      }
    }
  }

  return blocks;
}

function contentToPortableText(content) {
  const value = (content || '').trim();
  if (!value) {
    return [];
  }

  if (/<\/?(h2|h3|p|ul|li)\b/i.test(value)) {
    return htmlToPortableText(value);
  }

  return markdownToPortableText(value);
}

function normalizeDate(value) {
  if (!value) {
    return new Date().toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00.000Z`;
  }

  return new Date(value).toISOString();
}

async function migrate() {
  if (!token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN (or SANITY_AUTH_TOKEN) environment variable for write access');
  }

  console.log(`Starting migration for ${BLOG_POSTS.length} posts...`);

  for (const post of BLOG_POSTS) {
    const portableContent = contentToPortableText(post.content);

    const doc = {
      _id: `blogPost.${post.id}`,
      _type: 'blogPost',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt,
      content: portableContent,
      author: post.author || 'RAPIDRY Care Team',
      date: normalizeDate(post.date),
      readTime: post.readTime,
      tags: Array.isArray(post.tags) ? post.tags : [],
    };

    if (post.coverImage) {
      doc.coverImage = post.coverImage;
    }

    await sanityClient.createOrReplace(doc);
    console.log(`Upserted: ${post.title}`);
  }

  const verification = await sanityClient.fetch(
    `*[_type == "blogPost" && _id match "blogPost.*"] | order(date desc) {title, "slug": slug.current, date}`
  );

  console.log('\nMigration complete. Imported posts:');
  verification.forEach((item, index) => {
    console.log(`${index + 1}. ${item.title} (${item.slug})`);
  });
}

migrate().catch((error) => {
  console.error('Migration failed:', error.message);
  process.exit(1);
});
