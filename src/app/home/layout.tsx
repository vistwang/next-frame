import Link from "next/link"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
        <header className="bg-blue-400 py-3 px-2 flex-0 text-white text-right">
          <Link className="mr-5 float-left" href="/">
          首页
          </Link>
          
        <Link className="mr-5" href="/posts/first-post">
          Blog Post
        </Link>
      
        <Link className="mr-5" href="/css/use-css">
          use-css
        </Link>
      
        <Link className="mr-5" href="/products">
          服务端组件 products
        </Link>
      
        <Link className="mr-5" href="/user">
          客户端组件 user
        </Link>
      
        <Link className="mr-5" href="/blog">
          SSG 博客
        </Link>
      
        <Link className="mr-5" href="/openai">
          openAI
        </Link>
      
        <Link className="mr-5" href="/grok">
          grok2
        </Link>
        <Link className="mr-5" href="/lexical">
        lexical富文本
        </Link>
          <div className="inline r">
            我是头
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-blue-400 flex-0 py-3 px-2 text-white text-right">我是尾</footer>
    </>
  )
}
