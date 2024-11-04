export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="h-full border-blue-400 border-40">
        <h1 className='text-blue-400'>我是products layout</h1>
        {children}
        </div>
  )
}
