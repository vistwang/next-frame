import Head from "next/head";

export default function FirstPost() {
  return (
    <>
        <style jsx>{
            `h1 {color: red }`
        }</style>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>First Post</h1>
    </>
  );
}
