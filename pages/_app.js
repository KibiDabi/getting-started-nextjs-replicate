import "../styles/globals.css";
import Head from "next/head";
import Layout from "../components/layout";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </Head>
      <div className="bg-[#17181C] text-white bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </>
  );
}
