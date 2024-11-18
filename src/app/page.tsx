import Link from 'next/link'

// 根目录
export default function Index() {
  return <div className="border-orange-400 border-40">
    <h1 className='text-orange-400'>我是home</h1>
    <ul className="flex justify-between relative rounded-xl overflow-auto p-8">
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/">
          Home
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/posts/first-post">
          Blog Post
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/css/use-css">
          use-css
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/products">
          服务端组件 products
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/user">
          客户端组件 user
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/blog">
          SSG 博客
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/openai">
          openAI
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/grok">
          grok2
        </Link>
      </li>
    </ul>
    </div>
}
