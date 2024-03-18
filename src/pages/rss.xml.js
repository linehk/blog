import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';
import {AUTHOR, DESCRIPTION} from '@consts';

export async function GET(context) {
  const posts = await getCollection('post');
  return rss({
    title: AUTHOR,
    description: DESCRIPTION,
    site: context.site,
    items: posts.map((p) => ({
      ...p.data,
      link: `/post/${p.slug}/`,
    })),
  });
}