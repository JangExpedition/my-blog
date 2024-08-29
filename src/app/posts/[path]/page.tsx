import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import PostHeader from "@/components/post-header";
import PostBody from "@/components/post-body";
import Giscus from "@/components/giscus";

export default async function Post({ params }: { params: { path: string } }) {
  const post = getPostBySlug(params.path);

  if (!post) return notFound();

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
