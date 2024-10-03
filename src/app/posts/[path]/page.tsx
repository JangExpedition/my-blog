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
    openGraph: {
      title: `Tazoal Log | ${post.title}`,
      description: `${post.description}`,
      images: "/assets/blog/author/profile.png",
    },
    verification: {
      google: "5Rxhu8VWiPcCxzU0LeH3eHf8lNFPickkrLJmxds1-Z8",
      other: {
        "naver-site-verification": "247468c1865867ca8a22d2ae4d87f58c03bffbb8",
      },
    },
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
