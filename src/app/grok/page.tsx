"use client";
import { useEffect, useCallback, KeyboardEvent, useState } from "react";

export default function Index() {
  const [answer, setAnswer] = useState('');
  useEffect(() => {
    console.log(12345);
  }, []);


  const getAnswer = useCallback(async (event: KeyboardEvent<HTMLInputElement>) => {
    // 检查按下的是否是回车键
    if (event.key === 'Enter') {
      // 在这里处理回车键被按下的逻辑
      console.log('--------->', (event.target as HTMLInputElement).value);
      const res = await fetch('http://localhost:3000/api/grok2', {
        method: 'post',
        body: JSON.stringify({
          content: (event.target as HTMLInputElement).value
        })
      });
      const jsonData: { data: {content: string}; } = await res.json();
      console.log('jsonData--------->', jsonData);
      setAnswer(jsonData.data.content);
      // 阻止表单默认提交行为
      event.preventDefault();
    }
  }, []);
  return (
    <div className="border-green-400 border-40">
    <h1 className='text-green-400'>我是 grok2</h1>
    <div className="flex items-center">
      <input onKeyDown={(e) => getAnswer(e)} type="text" className="w-full bg-clip-padding ml-4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
    </div>
    <textarea className="w-full min-h-40 h-auto" name="" id="" value={answer} readOnly />
    </div>
  )
}
