import { BlogPost } from '@/types';
import { Metadata } from 'next';

// 设置页面的 Metadata
export const metadata: Metadata = {
  title: '博客',
  description: '博客列表SSG',
};


// 获取博客列表数据
async function getPosts(): Promise<BlogPost[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    // force-cache 选项表示静态生成页面
    cache: 'force-cache',
    next: { revalidate: 60 }, // 每60秒重新生成一次静态页面
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog');
  }
  return res.json();
}

// 博客列表页面组件
export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>博客页面</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={post.id}>
            {index}：<a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
