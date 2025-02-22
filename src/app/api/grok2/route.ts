import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type Props = {
    body: Promise<{
      content: string
    }>
  }

const grok = new OpenAI({
    apiKey: 'xai-1jWyHQEoCuAhOC5sB4p74AtRTLl2jNNT6orOegn0AqF5X1oz6h9dE8kz5WsUeWgbivAz5EJFw3cY6Llt',
    // baseURL: 'https://api.x.ai/v1/chat/completions',
    baseURL: 'https://api.x.ai/v1',
})

export async function POST(request: NextRequest) {
    // 读取请求体中的JSON数据
    const body = await request.json();
    const { content } = body;    
    const completion = await grok.chat.completions.create({
        messages: [
            {role: "system", content: "You are Grok, a chatbot inspired by the Hitchhikers Guide to the Galaxy."},
            {role: "user", "content": content}
        ],
        model: "grok-beta", // 指定模型
        stream: false,
        temperature: 0
    })        
    return NextResponse.json({
        data: completion.choices[0].message,
    });
}