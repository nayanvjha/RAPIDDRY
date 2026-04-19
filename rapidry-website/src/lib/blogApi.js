import { sanityClient } from './sanityClient.js';

export async function getAllBlogPosts() {
  const query = `*[_type == "blogPost"] | order(date desc) {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    author,
    date,
    readTime,
    coverImage,
    tags
  }`;

  return sanityClient.fetch(query);
}

export async function getBlogPostBySlug(slug) {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    "id": _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    author,
    date,
    readTime,
    coverImage,
    tags
  }`;

  return sanityClient.fetch(query, { slug });
}

export async function getAdjacentPosts(date) {
  const query = `{
    "previous": *[_type == "blogPost" && date < $date] | order(date desc)[0] {
      title,
      "slug": slug.current
    },
    "next": *[_type == "blogPost" && date > $date] | order(date asc)[0] {
      title,
      "slug": slug.current
    }
  }`;

  return sanityClient.fetch(query, { date });
}
