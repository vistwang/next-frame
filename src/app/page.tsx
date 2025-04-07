import PostCard from '@/components/home/PostCard';

// 模拟的博客文章数据
const dummyPosts = [
  {
    title: "探索 Next.js 15 的新特性",
    excerpt: "了解最新版本的 Next.js 带来的令人兴奋的功能和改进。",
    date: "2025年4月7日", // 使用动态日期或实际日期
    slug: "exploring-nextjs-15",
  },
  {
    title: "使用 Tailwind CSS 构建响应式设计",
    excerpt: "学习如何利用 Tailwind CSS 的实用工具类快速创建现代、响应式的用户界面。",
    date: "2025年4月5日",
    slug: "responsive-design-with-tailwind",
  },
  {
    title: "TypeScript 在现代 Web 开发中的优势",
    excerpt: "为什么 TypeScript 正在成为构建健壮、可维护 Web 应用的首选。",
    date: "2025年4月2日",
    slug: "typescript-advantages",
  },
  {
    title: "简约设计的力量",
    excerpt: "少即是多：探讨简约设计原则如何提升用户体验。",
    date: "2025年3月30日",
    slug: "power-of-minimalism",
  },
   {
    title: "博客文章标题五",
    excerpt: "这是第五篇博客文章的简短描述，用于测试布局。",
    date: "2025年3月28日",
    slug: "post-five",
  },
   {
    title: "第六篇：状态管理模式",
    excerpt: "比较不同的前端状态管理解决方案及其适用场景。",
    date: "2025年3月25日",
    slug: "state-management-patterns",
  },
];

// 获取当前年份和月份，模拟更真实的日期
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.toLocaleString('zh-CN', { month: 'long' });

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16">
      {/* Hero Section */}
      <section className="text-center pt-8 overflow-hidden"> {/* overflow-hidden 防止动画初始偏移影响布局 */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-300 dark:to-yellow-500
                       animate-fadeInUp duration-700 ease-out">
          欢迎来到我的博客
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto
                      animate-fadeInUp duration-700 ease-out delay-200">
          探索 Web 开发、设计与技术的思考与实践 @ {currentYear} {currentMonth}.
        </p>
         {/* 可以添加一个按钮 */}
        {/* <button className="button-primary mt-6 animate-fadeInUp duration-700 ease-out delay-300">开始阅读</button> */}
      </section>

      {/* Posts Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 border-l-4 border-[var(--primary)] pl-4
                       animate-fadeInLeft duration-500 ease-out delay-300">
          最新文章
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {dummyPosts.map((post, index) => (
            <PostCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date} // 可以替换为更动态的日期
              slug={post.slug}
              // 传递动画延迟，实现交错效果
              animationDelay={`${100 + index * 100}ms`} // 基础延迟 + 递增延迟
            />
          ))}
        </div>
      </section>
    </div>
  );
}