import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type Props = {
    body: Promise<{
      content: string
    }>
  }

const openai = new OpenAI({
    apiKey: 'sk-qfzbRXNc2hYp6uAkM2eLIGCFTAJyynfenocPrK7c8ELeUmKq',
    baseURL: 'https://api.moonshot.cn/v1',
})

export async function POST(request: NextRequest) {
    // 读取请求体中的JSON数据
    const body = await request.json();
    const { content } = body;
    console.log('content=========>', content);
    
    const completion = await openai.chat.completions.create({
        model: "moonshot-v1-8k",  // 指定模型
    messages: [
        {role: "system", content: "你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。"},
        {"role": "user", "content": content}
    ],
    temperature: 0.3,  // 控制回答的随机性
    })
        
    return NextResponse.json({
        data: completion.choices[0].message.content,
    });
}