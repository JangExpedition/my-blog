import { getAllPosts } from "@/lib/api";
import PostPreview from "@/components/post-preview";

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-10 max-w-full">
      {allPosts.map((post) => (
        <PostPreview key={post.path} {...post} />
      ))}
    </div>
  );
}
