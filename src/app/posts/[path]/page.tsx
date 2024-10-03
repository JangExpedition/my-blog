import { getAllPosts, getPostBySlug } from "@/lib/api";
import PostHeader from "@/components/post-header";
import PostBody from "@/components/post-body";
import Giscus from "@/components/giscus";
import { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  let allPosts = getAllPosts();
  return allPosts.map((post) => ({
    path: post.path,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { path: string };
}): Metadata {
  const post = getPostBySlug(params.path);

  return {
    title: `Tazoal Log | ${post.title}`,
    description: `${post.description}`,
    icons: {
      icon: "./favicon.ico",
    },
    openGraph: {
      title: `Tazoal Log | ${post.title}`,
      description: `${post.description}`,
      siteName: "Tazoal Log",
      type: "website",
      images: "/assets/blog/author/profile.png",
    },
    verification: { google: "5Rxhu8VWiPcCxzU0LeH3eHf8lNFPickkrLJmxds1-Z8" },
  };
}

export default async function Page({ params }: { params: { path: string } }) {
  const post = getPostBySlug(params.path);

  return (
    <div className="p-5 max-w-[700px] mx-auto">
      <PostHeader
        title={post.title}
        coverImage={post.thumbnail}
        date={post.createdAt}
        tags={post.tags}
      />
      <PostBody content={post.content} />
      <Giscus />
    </div>
  );
}
