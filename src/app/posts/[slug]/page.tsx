import { getPostBySlug } from "@/lib/api";
import { notFound } from "next/navigation";
import PostHeader from "@/components/post-header";
import PostBody from "@/components/post-body";

export default async function Post({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) return notFound();

  return (
    <div className="p-5">
      <PostHeader
        title={post.title}
        coverImage={post.coverImage}
        date={post.date}
        author={post.author}
      />
      <PostBody content={post.content} />
    </div>
  );
}
