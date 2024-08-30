import { getAllPosts } from "@/lib/api";
import PostPreview from "@/components/post-preview";
import Tag from "@/components/tag";
import Category from "@/components/category";

export default function Home({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string };
}) {
  const { category, tag } = searchParams;

  let allPosts = getAllPosts();
  if (category && category !== "ALL") {
    allPosts = allPosts.filter((post) => post.category === category);
  }
  if (tag) {
    allPosts = allPosts.filter((post) => post.tags.includes(tag));
  }

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
        <Category category={category} />
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
            {uniqueTags.map((tagName) => (
              <Tag
                key={tagName}
                tagName={tagName}
                category={category}
                tag={tag}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
