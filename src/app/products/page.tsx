import Link from "next/link";

export default function Index() {
  return (
    <div className="h-full border-green-400 border-40">
    <h1 className='text-green-400'>我是 products 内容</h1>
    <Link href="products/12345">
      product 详情
      </Link>
    </div>
  )
}
