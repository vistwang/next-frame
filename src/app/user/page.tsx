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
    <p>
    <Link href="/">
      首页
      </Link>
    </p>
    </div>
  )
}
