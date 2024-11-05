import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        message: "我是产品详情，我的产品内容如下",
        name: "我的数据从服务端组件传递给了客户端组件",
        dataArray: [1, 2, 3, 4, 5]
    };
    return NextResponse.json(data);
}