'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"  // 通过 CSS 类名切换主题
      defaultTheme="system"  // 默认跟随系统主题
      enableSystem  // 启用系统主题检测
      disableTransitionOnChange  // 禁用切换时的过渡闪烁
    >
      {children}
    </NextThemesProvider>
  );
}