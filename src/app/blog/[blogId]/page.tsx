import { BlogPost } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';


// 获取单个博客详情
async function getPost(blogId: string): Promise<BlogPost | null> {
  const res = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
    cache: 'force-cache',
  });

  if (!res.ok) {
    return null;
  }
  return res.json();
}

// 动态生成 Metadata
export async function generateMetadata({ params }: { params: { blogId: string } }): Promise<Metadata> {

  const { blogId } = await params
  
  const post = await getPost(blogId);
  return {
    title: post ? post.title : 'Blog Post',
    description: post ? post.content.slice(0, 160) : 'Blog post details',
  };
}

// 博客详情页面组件
export default async function BlogPostPage({ params }: { params: { blogId: string } }) {
  const { blogId } = await params;

  const post = await getPost(blogId);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  );
}


export async function generateStaticParams() {
  const ids = [1, 2, 3];
  return ids.map((id) => ({ id: id.toString() }));
}