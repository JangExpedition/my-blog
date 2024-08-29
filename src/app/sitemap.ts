import { getAllPosts } from "@/lib/api";

export default async function sitemap() {
  const baseUrl = "https://tazoal.vercel.app";

  const posts = await getAllPosts();
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.path}`,
    lastModified: post.createdAt,
  }));
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/posts`, lastModified: new Date() },

    ...postUrls,
  ];
}
