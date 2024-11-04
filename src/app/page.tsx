import Link from 'next/link'

// 根目录
export default function Index() {
  return <div className="h-full border-orange-400 border-40">
    <h1 className='text-orange-400'>我是home</h1>
    <ul className="flex justify-between relative rounded-xl overflow-auto p-8">
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/">
          Home
        </Link>
      </li>
      <li className="p-4 h-14 rounded-lg flex items-center justify-center bg-sky-300 shadow-lg">
        <Link href="/user">
          user
        </Link>
        {/* <a href="/user">Home</a> */}
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
          products
        </Link>
      </li>
    </ul>
    </div>
}
