import { Author } from "@/interfaces/author";
import Image from "next/image";

export default function PostHeader({
  title,
  coverImage,
  date,
  author,
}: {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
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
        <div className="flex justify-start items-center gap-2">
          <Image
            src={author.picture}
            alt="작성자 사진"
            width={30}
            height={30}
            className="rounded-[50%]"
          />
          <p className="text-[17px] whitespace-nowrap font-semibold leading-[30px]">
            {author.name}
          </p>
        </div>
        <p className="text-sm leading-tight text-gray-400">{date}</p>
      </div>
    </div>
  );
}
