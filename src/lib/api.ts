import path, { join } from "path";
import fs from "fs";
import matter from "gray-matter";
import sizeOf from "image-size";
import { Post } from "@/interfaces/post";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContents);

  return { ...data, path: realSlug, content } as Post;
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.createdAt > post2.createdAt ? -1 : 1));
  return posts;
}

export function getImageSize(src: string) {
  const imagePath = path.join(process.cwd(), "public", src);
  const imageBuffer = fs.readFileSync(imagePath);
  const { width, height } = sizeOf(imageBuffer);
  return { width, height };
}
