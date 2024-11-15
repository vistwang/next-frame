import { NextResponse } from 'next/server';
import OpenAI from 'openai';
const openai = new OpenAI({
    apiKey: '$API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC',
    baseURL: 'https://integrate.api.nvidia.com/v1',
})


export async function POST() {
    const completion = await openai.chat.completions.create({
        model: "google/codegemma-7b",
        messages: [{"role":"user","content":"你好，我在上海，今天的天气怎么样"}],
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1024,
        stream: true,
    })
        
    for await (const chunk of completion) {
        process.stdout.write(chunk.choices[0]?.delta?.content || '')
    }
        
    return NextResponse.json('');
}