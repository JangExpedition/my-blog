import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import PostHeader from "@/components/post-header";
import PostBody from "@/components/post-body";
import Giscus from "@/components/giscus";

export default async function Post({ params }: { params: { path: string } }) {
  const post = getPostBySlug(params.path);

  if (!post) return notFound();

  return (
    <div className="p-5">
      <PostHeader
        title={post.title}
        coverImage={post.coverImage}
        date={post.date}
      />
      <PostBody content={post.content} />
      <Giscus />
    </div>
  );
}
