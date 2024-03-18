import {defineCollection, z} from 'astro:content';

const post = defineCollection({
  type: 'content',
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    lastmod: z.coerce.date().optional(),
    keywords: z.array(z.string()),
    description: z.string(),
    categories: z.array(z.string()),
  }),
});

export const collections = {post};