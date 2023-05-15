import { ApolloProvider } from "@apollo/client";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import Head from "next/head";
import client from "../utils/apollo";
import "../styles/web3bio.scss";

export default function App({ Component, pageProps }) {
  const { asPath } = useRouter();
  let pageLink = `${process.env.NEXT_PUBLIC_BASE_URL}${asPath}`;
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index, follow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, shrink-to-fit=no"
        />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="google-site-verification"
          content="iaUpA0X2l6UNb8C38RvUe4i_DOMvo5Ciqvf6MtYjzPs"
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/ico" />
      </Head>
      <DefaultSeo
        title="Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service"
        description="Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities."
        canonical={pageLink}
        openGraph={{
          type: "website",
          url: pageLink,
          site_name: "Web3.bio",
          title: "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
          description: "Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities.",
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/img/web3bio-social.jpg`,
            },
          ],
        }}
        twitter={{
          handle: "@web3bio",
          site: "@web3bio",
          cardType: "summary",
        }}
      />
      <Component {...pageProps} />
      <GoogleAnalytics strategy="lazyOnload" />
    </ApolloProvider>
  );
}
