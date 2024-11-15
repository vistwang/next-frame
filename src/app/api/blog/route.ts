import { BlogPost } from '@/types';
import { NextResponse } from 'next/server';

export async function GET() {
    const data: BlogPost[] = [
        { id: 1, userId: 1, title: "第一篇文章", body: "这是一篇内容丰富的文章" },
        { id: 2, userId: 2, title: "第二篇文章", body: "更多内容在这里！" },
        { id: 3, userId: 3, title: "第三篇文章", body: "更多内容在这里！" },
      ];
    return NextResponse.json(data);
}