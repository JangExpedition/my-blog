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
                className={`w-[72px] absolute bottom-[-1px] h-[2px] bg-point-high left-[${
                  (index + 1) * 72
                }px]`}
              ></div>
            )}
            <div className="flex justify-center items-center relative cursor-pointer">
              <Link
                href={`/?category=${category.en}`}
                className={`font-bold text-[17px] text-center w-[72px] h-[47px] leading-[47px] px-[20px] ${
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
