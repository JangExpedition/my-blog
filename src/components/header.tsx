"use client";
import Link from "next/link";
import ThemeButton from "./theme-button";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const borderStyle = {
    background: `linear-gradient(to right, rgba(255, 84, 15, 1) ${scrollProgress}%, #e5e7eb ${scrollProgress}%)`,
    height: "1px",
    width: "100%",
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / windowHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="w-full h-[60px] fixed top-0 z-50 bg-white dark:bg-black">
      <div className="w-[92%] h-full flex justify-between items-center mx-auto">
        <Link href={"/"}>
          <p className="text-[24px] font-[700] italic hover:underline">
            Tazoal<span className="text-point-high">.</span>
          </p>
        </Link>
        <ul>
          <li>{/* <ThemeButton /> */}</li>
        </ul>
      </div>
      <div className="absolute bottom-0 left-0" style={borderStyle}></div>
    </header>
  );
}
