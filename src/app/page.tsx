import Link from 'next/link'

// 根目录
function Home() {
  return (
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
    </ul>
  )
}

export default Home;