import { getAllPosts } from "@/lib/api";
import PostPreview from "@/components/post-preview";
import Tag from "@/components/tag";

export default function Home() {
  const allPosts = getAllPosts();
  const tags = Object.values(allPosts.map((post) => post.tags)).reduce(
    (prev, cur) => {
      return [...prev, ...cur];
    },
    []
  );
  const uniqueTags = tags.filter((tag, index) => tags.indexOf(tag) === index);

  return (
    <div className="w-full flex justify-evenly">
      <div className="flex flex-col justify-start items-center max-w-[700px] px-6">
        {allPosts.map((post) => (
          <PostPreview key={post.path} {...post} />
        ))}
      </div>
      <div className="px-6 pb-12 border-l-[1px] hidden lg:block">
        <div className="w-[300px]">
          <span className="text-gray-500 font-semibold text-[13px] dark:text-white">
            태그
          </span>
          <div className="mt-3">
            {uniqueTags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
