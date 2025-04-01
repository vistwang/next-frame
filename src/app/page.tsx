import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'


export default function Page() {
  return <>
  <h1>江林达，我爱你 <Heart /></h1>
  <Link href="/dino-run">
  <Button>小鸡快跑游戏</Button>
</Link>
  </>
}