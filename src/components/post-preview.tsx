import { Post } from "@/interfaces/post";
import Image from "next/image";
import Link from "next/link";

export default function PostPreview({
  slug,
  title,
  date,
  coverImage,
  author,
  excerpt,
  ogImage,
  content,
  preview,
}: Post) {
  return (
    <div className="mt-[40px]">
      <Link href={`/posts/${slug}`} aria-label={title}>
        <Image
          src={coverImage}
          alt={`Cover Image for ${title}`}
          width={1300}
          height={630}
          className="h-[316px] min-w-[320px] rounded-[20px]"
        />
        <div>
          <div className="mt-4 border-[2px] rounded-[20px] border-black p-2 w-fit font-[800]">
            {date}
          </div>
          <h2 className="mt-[10px] font-[700] text-2xl">{title}</h2>
        </div>
      </Link>
    </div>
  );
}
