import Image from "next/image";
import Author from "./author";
import Tag from "./tag";

export default function PostHeader({
  title,
  coverImage,
  description,
  date,
  tags,
  category,
}: {
  title: string;
  coverImage: string;
  description: string;
  date: string;
  tags: string[];
  category: "DEV" | "DAILY";
}) {
  return (
    <div className="w-full bg-gray-100 dark:bg-black py-[60px] mb-[48px] border-b-[1px]">
      <div className="mx-auto max-w-[720px] px-[20px]">
        <div className="w-full mt-9 overflow-hidden flex justify-center items-center rounded-[20px] mb-[16px]">
          <Image
            src={coverImage}
            alt={`Cover Image for ${title}`}
            width={700}
            height={350}
            className="object-cover w-full"
          />
        </div>
        <p className="text-point-high font-bold mb-[16px]">{category}</p>
        <h1 className="mb-[8px] font-bold text-[32px] leading-tight break-words">
          {title}
        </h1>
        <p style={{ color: "#666666" }} className="mb-[24px] dark:text-white">
          {description}
        </p>
        <div className="w-full mb-[16px]">
          {tags.map((tag) => (
            <Tag key={tag} tagName={tag} />
          ))}
        </div>
        <p style={{ color: "#666666" }} className="dark:text-white">
          {date}
        </p>
      </div>
    </div>
  );
}
