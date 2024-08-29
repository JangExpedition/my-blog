import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import DarkThemeProvider from "@/components/dark-theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Tazoal Log", template: "Tazoal Log | %s" },
  description: "웹 프론트엔드 개발자 장원정입니다.",
  icons: {
    icon: "./favicon.ico",
  },
  openGraph: {
    images: "/assets/blog/author/profile.png",
  },
  verification: { google: "5Rxhu8VWiPcCxzU0LeH3eHf8lNFPickkrLJmxds1-Z8" },
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
