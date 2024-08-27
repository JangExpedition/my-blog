import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-[60px] border-b-[1px] fixed top-0 z-50 bg-white">
      <div className="w-[92%] h-full flex justify-between items-center mx-auto">
        <Link href={"/"}>
          <p className="text-[24px] font-[700] italic hover:underline">
            Tazoal.
          </p>
        </Link>
      </div>
    </header>
  );
}
