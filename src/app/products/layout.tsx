export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="border-red-400 border-40">
        <h1 className='text-red-400'>我是products layout</h1>
        {children}
    </div>
  )
}
