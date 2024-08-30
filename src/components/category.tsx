import Link from "next/link";

const CATEGORY = [
  { en: "ALL", ko: "전체", selected: true },
  { en: "DEV", ko: "개발", selected: false },
  { en: "DAILY", ko: "일상", selected: false },
];

export default function Category({
  category,
}: {
  category: string | undefined;
}) {
  if (category) {
    CATEGORY.map((cate) =>
      cate.en === category ? (cate.selected = true) : (cate.selected = false)
    );
  }
  return (
    <div className="flex flex-col py-[10px] w-full">
      <div className="relative flex max-w-full h-[47px] pb-[2px] border-b-[1px]">
        {CATEGORY.map((category, index) => (
          <div key={category.en}>
            {category.selected && (
              <div
                className={`w-[74px] absolute bottom-0 h-[2px] bg-gray-900 dark:bg-white left-[${
                  (index + 1) * 74
                }px]`}
              ></div>
            )}
            <div className="flex justify-center items-center relative cursor-pointer py-[10px] px-[20px]">
              <Link
                href={`/?category=${category.en}`}
                className={`font-bold text-[17px] text-left leading-[1.6] ${
                  category.selected
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {category.ko}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
