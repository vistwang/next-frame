import ServerComponentExample from '@/app/components/server-components/ServerComponentExample'


export default function Index() {
  return (
    <div className="h-full border-pink-400 border-40">
    <h1 className='text-pink-400'>我是 product id 内容</h1>
    <ServerComponentExample />
    </div>
  )
}
