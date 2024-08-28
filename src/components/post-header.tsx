import Image from "next/image";
import Author from "./author";

export default function PostHeader({
  title,
  coverImage,
  date,
}: {
  title: string;
  coverImage: string;
  date: string;
}) {
  return (
    <div className="w-full">
      <div className="w-full max-h-[700px] overflow-hidden flex justify-center items-center rounded-[20px]">
        <Image
          src={coverImage}
          alt={`Cover Image for ${title}`}
          width={100}
          height={100}
          className="object-cover w-full"
        />
      </div>
      <h1 className="mt-5 font-[700] text-5xl leading-tight break-words">
        {title}
      </h1>
      <div className="mt-5 flex flex-col gap-1">
        <Author />
        <p className="text-sm leading-tight text-gray-400">{date}</p>
      </div>
    </div>
  );
}
