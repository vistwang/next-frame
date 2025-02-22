"use client";
import Link from "next/link";
import ClientComponentExample from '@/app/components/client-components/ClientComponentExample'
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log(12345);
  }, [])
  return (
    <div className="border-green-400 border-40">
    <h1 className='text-green-400'>我是 客户端组件</h1>
    <ClientComponentExample />
    <div className="grid gap-4 grid-cols-12 font-mono text-white text-sm text-center font-bold leading-6 bg-stripes-fuchsia rounded-lg">
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">01</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">02</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">03</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">04</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">05</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">06</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">07</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">08</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">09</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">10</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">11</div>
      <div className="p-4 rounded-lg shadow-lg bg-fuchsia-500">12</div>
      <div className="p-4 rounded-lg shadow-lg bg-stripes-pink">13</div>
    </div>
    </div>
  )
}
