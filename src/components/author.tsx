import Image from "next/image";

export default function Author() {
  return (
    <div className="flex justify-start items-center gap-2">
      <Image
        src={"/assets/blog/author/profile.png"}
        alt="작성자 사진"
        width={30}
        height={30}
        className="rounded-[50%]"
      />
      <p className="text-[17px] whitespace-nowrap font-semibold leading-[30px]">
        장원정
      </p>
    </div>
  );
}
