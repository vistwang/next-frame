'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'; // 确保已安装 @heroicons/react

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载完成前，渲染一个占位符或 null，防止水合错误
  if (!mounted) {
    // 保持按钮空间，避免布局跳动
    return <div className="w-10 h-10 p-2"></div>;
    // 或者 return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // 根据当前主题决定显示哪个图标和 aria-label
  const isLight = theme === 'light';
  const Icon = isLight ? MoonIcon : SunIcon;
  const label = `切换到${isLight ? '深色' : '浅色'}模式`;
  const iconColor = isLight ? "text-gray-700" : "text-yellow-400"; // 深色用黄色太阳

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors"
      aria-label={label}
    >
      <Icon className={`h-6 w-6 ${iconColor}`} />
    </button>
  );
}