import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import DarkThemeProvider from "@/components/dark-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tazoal Log",
  description: "웹 프론트엔드 개발자 장원정입니다.",
  openGraph: {
    images: "/assets/blog/author/profile.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkThemeProvider>
          <Header />
          <main>
            <div className="max-w-[900px] mt-[60px] mx-auto min-h-[calc(100vh-60px)]">
              {children}
            </div>
          </main>
        </DarkThemeProvider>
      </body>
    </html>
  );
}
