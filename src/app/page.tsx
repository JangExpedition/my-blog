import { getAllPosts } from "@/lib/api";
import PostPreview from "@/components/post-preview";
import Tag from "@/components/tag";
import Category from "@/components/category";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tazoal Log",
  description: "웹 프론트엔드 개발자 장원정입니다.",
  openGraph: {
    title: "Tazoal Log",
    description: "웹 프론트엔드 개발자 장원정입니다.",
    images: "/assets/blog/author/profile.png",
  },
  verification: {
    google: "5Rxhu8VWiPcCxzU0LeH3eHf8lNFPickkrLJmxds1-Z8",
    other: {
      "naver-site-verification": "247468c1865867ca8a22d2ae4d87f58c03bffbb8",
    },
  },
  keywords: [
    "Tazoal Log",
    "Tazoal",
    "타조알",
    "타조알 로그",
    "타조알 블로그",
    "장원정",
    "장원정 블로그",
    "개발자 블로그",
    "프론트엔드 개발자 블로그",
  ],
};

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
    <div className="max-w-[1200px] mt-[60px] mx-auto min-h-[calc(100vh-200px)] flex flex-col justify-start items-center">
      <Category category={category} />
      <div className="w-full">
        {uniqueTags.map((tagName) => (
          <Tag key={tagName} tagName={tagName} category={category} tag={tag} />
        ))}
      </div>
      <div className="flex flex-col justify-start items-center w-full px-6 mx-auto">
        {allPosts.map((post) => (
          <PostPreview key={post.path} {...post} />
        ))}
      </div>
    </div>
  );
}
