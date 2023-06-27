import Head from "next/head";
import { Footer } from "../components/shared/Footer";
import "../styles/web3bio.scss";
import { headers } from "next/headers";

export async function generateMetadata() {
  const headerList = headers();
  const domain = headerList.get("host") || "";
  const fullUrl = headerList.get("referer") || "";
  const [, pathname] =
    fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];
  return {
    title:
      "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
    description:
      "Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities.",
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
      siteName: "Web3.bio",
      title:
        "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
      description:
        "Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities.",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/img/web3bio-social.jpg`,
        },
      ],
    },
  };
}
export default function RootLayout({ children, modal }) {
  return (
    <html>
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
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <body>
        <div className="web3bio-container">
          <div className="web3bio-cover flare"></div>
          {children}
          {modal}
        </div>
        <Footer />
      </body>
    </html>
  );
}
