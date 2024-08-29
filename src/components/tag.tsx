import Link from "next/link";

export default function Tag({ tag }: { tag: string }) {
  return (
    <div className="pr-2 pb-[10px] cursor-pointer w-fit inline-block">
      <Link
        href={"/"}
        className="rounded-[19px] inline-flex justify-center items-center font-semibold text-[13px] bg-gray-200 dark:bg-gray-400 py-1 px-[10px] text-gray-500 leading-[1.6] hover:text-blue-700 hover:bg-gray-300 dark:hover:bg-gray-800"
      >
        {`# ${tag}`}
      </Link>
    </div>
  );
}
