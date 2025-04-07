'use client'
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { motion } from 'framer-motion';


export default function Page() {
  return <>
  <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
<h1>江林达，我爱你 <Heart /></h1>
</motion.div>
  <Link href="/dino-run">
  <Button>小鸡快跑游戏</Button>
</Link>
  </>
}