import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        message: "我是用户详情，我的用户内容如下",
        dataArray: [1, 2, 3, 4, 5]
    };
    return NextResponse.json(data);
}