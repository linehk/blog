import rss from '@astrojs/rss';
import {getCollection} from 'astro:content';
import {AUTHOR, DESCRIPTION} from '@consts';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const posts = (await getCollection('post')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    stylesheet: '/pretty-feed-v3.xsl',
    title: AUTHOR,
    description: DESCRIPTION,
    site: context.site,
    items: posts.map((p) => ({
      ...p.data,
      link: `/post/${p.slug}/`,
      content: sanitizeHtml(parser.render(p.body)),
    })),
  });
}