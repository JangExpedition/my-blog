"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect } from "react";

export default function ThemeButton() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setTheme(resolvedTheme === "light" ? "light" : "dark");
  }, []);

  return (
    <button
      className={`rounded=[50%] rounded-[50%] p-2 ${
        theme === "light" ? "hover:bg-gray-300" : "hover:bg-gray-800"
      }`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Image
        src={
          theme === "light"
            ? "/assets/images/moon.png"
            : "/assets/images/sun.png"
        }
        alt={`${theme} theme button`}
        width={20}
        height={20}
      />
    </button>
  );
}
