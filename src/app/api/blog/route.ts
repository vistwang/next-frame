import { BlogPost } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
    const data: BlogPost[] = [
        { id: 1, title: "第一篇文章", content: "这是一篇内容丰富的文章" },
        { id: 2, title: "第二篇文章", content: "更多内容在这里！" },
      ];
    return NextResponse.json(data);
}