import { getAllPosts } from "@/lib/api";
import PostPreview from "@/components/post-preview";

export default function Home() {
  const allPosts = getAllPosts();

  return (
    <div className="flex flex-col justify-start items-center max-w-[700px] px-6">
      {allPosts.map((post) => (
        <PostPreview key={post.path} {...post} />
      ))}
    </div>
  );
}
