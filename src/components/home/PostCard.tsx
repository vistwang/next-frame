import Link from 'next/link';

interface PostCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  animationDelay?: string; // 动画延迟属性
}

export default function PostCard({ title, excerpt, date, slug, animationDelay }: PostCardProps) {
  return (
    // 应用动画效果和延迟到外部容器
    <div
      className="h-full animate-fadeInUp duration-500 ease-out fill-mode-backwards"
      style={{ animationDelay: animationDelay || '0ms' }}
    >
      <Link href={`/posts/${slug}`} legacyBehavior>
        {/* 使用 flex 和 flex-col 使内部元素能用 mt-auto */}
        <a className="flex flex-col h-full p-5 md:p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--card)] shadow-sm hover:shadow-lg hover:border-[var(--primary)] dark:hover:border-[var(--primary)] transition-all duration-300 group">
          <h2 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors text-[var(--card-foreground)]">
            {title}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4 line-clamp-3"> {/* line-clamp 限制行数 */}
            {excerpt}
          </p>
          {/* mt-auto 将日期推到底部 */}
          <p className="text-xs text-[var(--muted-foreground)] mt-auto pt-2 border-t border-dashed border-gray-200 dark:border-gray-700/50">
            {date}
          </p>
        </a>
      </Link>
    </div>
  );
}
// 注意：line-clamp 可能需要 @tailwindcss/line-clamp 插件，
// 如果 Tailwind CSS v3.3+，它可能是内置的。如果无效，请安装插件：
// npm install -D @tailwindcss/line-clamp
// 并在 tailwind.config.js 的 plugins 中添加 require('@tailwindcss/line-clamp')