import Link from "next/link";

export default function Tag({
  tagName,
  category,
  tag,
}: {
  tagName: string;
  category?: string | undefined;
  tag?: string | undefined;
}) {
  return (
    <div className="pr-2 pb-[10px] cursor-pointer w-fit inline-block">
      <Link
        href={`/${tag === tagName ? "?" : "?tag=" + tagName + "&"}${
          category ? "category=" + category : ""
        }`}
        className={`rounded-[19px] inline-flex justify-center items-center font-semibold text-[13px] leading-[1.6] py-1 px-[10px] 
          ${
            tag === tagName
              ? "text-blue-500 bg-blue-100 dark:text-gray-700 dark:bg-blue-400"
              : "text-gray-500 bg-gray-200 hover:text-blue-700 hover:bg-gray-300 dark:bg-gray-400 dark:hover:bg-gray-800"
          }
            `}
      >
        {`# ${tagName}`}
        {tagName === tag && <button className="h-full w-4 ml-1">x</button>}
      </Link>
    </div>
  );
}
