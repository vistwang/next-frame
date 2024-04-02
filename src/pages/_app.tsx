import type { AppProps } from 'next/app';
// 引入全局样式
import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
