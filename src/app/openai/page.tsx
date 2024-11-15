"use client";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log(12345);
  }, [])
  return (
    <div className="border-green-400 border-40">
    <h1 className='text-green-400'>我是 openai</h1>
    <div className="flex items-center">
      <input type="text" className="w-full bg-clip-padding ml-4 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500" />
    </div>
    </div>
  )
}
