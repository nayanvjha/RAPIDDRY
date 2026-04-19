import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const readToken = import.meta.env.VITE_SANITY_READ_TOKEN?.trim();

export const sanityClient = createClient({
  projectId: 'qrn7u0wh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: !readToken,
  token: readToken || undefined,
  perspective: 'published',
});

export const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);
