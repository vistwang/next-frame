import { BlogPost } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { id } = await params;
  const data: BlogPost[] = [
      { id: 1, title: "第一篇文章", content: "这是一篇内容丰富的文章" },
      { id: 2, title: "第二篇文章", content: "更多内容在这里！" },
      { id: 3, title: "第三篇文章", content: "更多内容在这里！" },
    ];
  const post = data.find((p) => p.id === Number(id));

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}