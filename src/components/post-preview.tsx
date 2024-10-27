import { Post } from "@/interfaces/post";
import Image from "next/image";
import Link from "next/link";

export default function PostPreview({
  title,
  createdAt,
  thumbnail,
  path,
  description,
}: Post) {
  return (
    <div className="mt-[40px] w-full">
      <Link
        href={`/posts/${path}`}
        aria-label={title}
        className="flex justify-between items-start py-6 group"
      >
        <div className="flex-1 flex flex-col justify-start items-start pr-5">
          <span className="mb-[6px] font-[700] text-xl break-words overflow-hidden text-ellipsis group-hover:text-point-high">
            {title}
          </span>
          <span className="text-gray-500 mb-[17px] font-normal text-[15px]">
            {description}
          </span>
          <span className="flex text-gray-700 font-normal text-[13px]">{`${createdAt} · 장원정`}</span>
        </div>
        <div className="rounded-[20px] w-[130px] h-[90px] mb-auto overflow-hidden">
          <Image
            src={thumbnail}
            alt={`Cover Image for ${title}`}
            width={130}
            height={90}
            className="w-full h-full group-hover:scale-110"
          />
        </div>
      </Link>
    </div>
  );
}
