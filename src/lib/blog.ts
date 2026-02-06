import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt: string;
  tags: string[];
  episode?: string;
}

export interface Post extends PostMeta {
  contentHtml: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  const posts = files.map((filename) => {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf-8");
    const { data } = matter(raw);
    const slug =
      (data.slug as string) ||
      filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
    return {
      title: data.title || "Untitled",
      date: data.date || "",
      slug,
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      episode: data.episode,
    } as PostMeta;
  });
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) return null;
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf-8");
    const { data, content } = matter(raw);
    const fileSlug =
      (data.slug as string) ||
      filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
    if (fileSlug === slug) {
      const contentHtml = marked(content) as string;
      return {
        title: data.title || "Untitled",
        date: data.date || "",
        slug: fileSlug,
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        episode: data.episode,
        contentHtml,
      };
    }
  }
  return null;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf-8");
    const { data } = matter(raw);
    return (
      (data.slug as string) ||
      filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "")
    );
  });
}
