import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex lg:flex-row flex-col gap-[10px] lg:gap-0 h-20 w-full overflow-hidden justify-center items-center bg-gray-100 dark:bg-gray-400 text-gray-500 dark:text-gray-700">
      <p className="font-normal text-[15px] ">
        <Link
          href={"https://github.com/JangExpedition"}
          className="hover:text-gray-800"
        >
          GitHub
        </Link>
      </p>
      <p className="font-normal text-[15px] ">
        <span className="pl-5">© Tazoal All Rights Reserved.</span>
      </p>
    </footer>
  );
}
