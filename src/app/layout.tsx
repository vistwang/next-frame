import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 示例字体
import { ThemeProvider } from "@/components/ThemeProvider"; // 确保路径正确
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "冰凡的博客",
  description: "Power by Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning={true}>
      {/* suppressHydrationWarning 防止主题切换水合错误 */}
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        {/* antialiased 改善字体渲染 */}
        <ThemeProvider
          attribute="class" // 使用 class 切换主题
          defaultTheme="system" // 默认跟随系统
          enableSystem // 允许跟随系统
          disableTransitionOnChange={false} // 允许主题切换时的颜色过渡
        >
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
