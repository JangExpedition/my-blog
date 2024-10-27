import Image from "next/image";
import Author from "./author";
import Tag from "./tag";

export default function PostHeader({
  title,
  description,
  date,
  tags,
  category,
}: {
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: "DEV" | "DAILY";
}) {
  return (
    <div className="w-full bg-gray-100 py-[60px] mb-[48px] border-b-[1px]">
      <div className="mx-auto max-w-[720px] px-[20px]">
        <p className="text-point-high font-bold mb-[16px]">{category}</p>
        <h1 className="mb-[8px] font-bold text-[32px] leading-tight break-words">
          {title}
        </h1>
        <p style={{ color: "#666666" }} className="mb-[24px]">
          {description}
        </p>
        <div className="w-full mb-[16px]">
          {tags.map((tag) => (
            <Tag key={tag} tagName={tag} />
          ))}
        </div>
        <p style={{ color: "#666666" }}>{date}</p>
      </div>
    </div>
  );
}
