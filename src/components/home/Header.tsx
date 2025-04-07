import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-14 px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[var(--primary)] hover:opacity-90 transition-opacity">
          冰凡的博客
        </Link>
        <nav className="flex items-center space-x-4">
          {/* 可选: 添加其他导航链接 */}
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">关于</Link>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}