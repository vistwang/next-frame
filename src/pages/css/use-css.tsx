import Head from "next/head";
import Layout from '../../components/layout'
// styled-components  不支持

export default function Index() {
  return (
    <Layout>
      <Head>
        <title>css Use</title>
      </Head>
      <h1 className="my-title">css Use</h1>
      <h1 className="global-css">css Use</h1>
    </Layout>
  );
}
