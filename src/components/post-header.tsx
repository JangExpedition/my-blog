import Image from "next/image";
import Author from "./author";
import Tag from "./tag";

export default function PostHeader({
  title,
  coverImage,
  date,
  tags,
}: {
  title: string;
  coverImage: string;
  date: string;
  tags: string[];
}) {
  return (
    <div className="w-full">
      <div className="w-full mt-9 overflow-hidden flex justify-center items-center rounded-[20px]">
        <Image
          src={coverImage}
          alt={`Cover Image for ${title}`}
          width={700}
          height={350}
          className="object-cover w-full"
        />
      </div>
      <h1 className="mt-5 font-bold text-5xl leading-tight break-words">
        {title}
      </h1>
      <div className="w-full mt-5">
        {tags.map((tag) => (
          <Tag key={tag} tagName={tag} />
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-1">
        <Author />
        <p className="text-sm leading-tight text-gray-400">{date}</p>
      </div>
    </div>
  );
}
