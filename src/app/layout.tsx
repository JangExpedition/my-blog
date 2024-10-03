import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import DarkThemeProvider from "@/components/dark-theme-provider";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

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
          <main className="pb-[60px] bg-white dark:bg-black">
            <div className="max-w-[1200px] mt-[60px] mx-auto min-h-[calc(100vh-200px)]">
              {children}
            </div>
          </main>
          <Footer />
        </DarkThemeProvider>
      </body>
    </html>
  );
}
