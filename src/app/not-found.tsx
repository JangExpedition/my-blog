import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center max-w-[700px] min-h-[calc(100vh-200px)] mx-auto">
      <h1 className="text-black dark:text-white font-bold text-3xl text-center m-auto">
        404: 존재하지 않는 페이지입니다.
      </h1>
    </div>
  );
}
