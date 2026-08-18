import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { HOME } from "@consts";

type Context = {
  site: string
}

export async function GET(context: Context) {
  const blog = (await getCollection("blog"))
    .filter(post => !post.data.draft);

  const projects = (await getCollection("projects"))
    .filter(project => !project.data.draft);

  const blogItems = blog.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    pubDate: post.data.date,
    link: `/blog/${post.slug}/`,
  }));

  const projectItems = projects.map((project) => ({
    title: project.data.title,
    description: project.data.description,
    pubDate: project.data.year
      ? new Date(project.data.year, 0, 1)
      : new Date(0),
    link: `/projects/${project.slug}/`,
  }));

  const items = [...blogItems, ...projectItems]
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: HOME.TITLE,
    description: HOME.DESCRIPTION,
    site: context.site,
    items,
  });
}
