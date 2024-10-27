import { Post } from "@/interfaces/post";
import Image from "next/image";
import Link from "next/link";
import Author from "./author";

export default function PostPreview({
  title,
  createdAt,
  path,
  description,
}: Post) {
  return (
    <div className="w-full">
      <Link
        href={`/posts/${path}`}
        aria-label={title}
        className="flex justify-between items-center py-[32px] group border-b-[1px]"
      >
        <div>
          <p className="mb-[6px] font-[700] text-[24px] break-words overflow-hidden text-ellipsis group-hover:text-point-high">
            {title}
          </p>
          <p
            className="mb-[17px] font-normal text-[15px]"
            style={{ color: "#666666" }}
          >
            {description}
          </p>
          <p
            className="flex font-normal text-[13px]"
            style={{ color: "#666666" }}
          >
            {createdAt}
          </p>
        </div>
        <Author />
      </Link>
    </div>
  );
}
