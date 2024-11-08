import Image from "next/image";

export default function Author() {
  return (
    <div className="flex justify-start items-center gap-2 min-h-full">
      <p className="whitespace-nowrap">Tazoal</p>
      <Image
        src={"/assets/images/profile.png"}
        alt="작성자 사진"
        width={48}
        height={48}
        className="rounded-[50%]"
      />
    </div>
  );
}
