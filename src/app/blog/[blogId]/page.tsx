import ClientComponentExample from '@/app/components/client-components/ClientComponentExample'
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    console.log(12345);
  }, [])
  return (
    <div className="border-green-400 border-40">
    <h1 className='text-green-400'>我是 nextjs 静态站点</h1>
    <ClientComponentExample />
    </div>
  )
}
