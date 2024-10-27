import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import DarkThemeProvider from "@/components/dark-theme-provider";
import Footer from "@/components/footer";

const notoSansKr = Noto_Sans_KR({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={notoSansKr.className}>
        {/* <DarkThemeProvider> */}
        <Header />
        <main className="pb-[60px] bg-white dark:bg-black">{children}</main>
        <Footer />
        {/* </DarkThemeProvider> */}
      </body>
    </html>
  );
}
