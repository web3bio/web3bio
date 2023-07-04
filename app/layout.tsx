import { Metadata } from "next";
import "../styles/web3bio.scss";

export async function generateMetadata(): Promise<Metadata> {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio/";
  const description =
    "Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities.";
  const defaultTitle =
    "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service";
  return {
    metadataBase: new URL(baseURL),
    robots: "index, follow",
    verification: {
      google: "iaUpA0X2l6UNb8C38RvUe4i_DOMvo5Ciqvf6MtYjzPs",
    },
    title: {
      default: defaultTitle,
      template: "%s - Web3.bio",
    },
    description,
    alternates: {
      canonical: `/`,
    },
    openGraph: {
      type: "website",
      url: `/`,
      siteName: "Web3.bio",
      title: {
        default: defaultTitle,
        template: "%s - Web3.bio",
      },
      description,
      images: [
        {
          url: "/img/web3bio-social.jpg",
        },
      ],
    },
    twitter: {
      site: "@web3bio",
      creator: "@web3bio",
    },
  };
}
export default function RootLayout({ children, modal }) {
  return (
    <html lang="en">
      <head>
        {/* custom meta tag add here */}
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <main>
          {children}
          {modal}
        </main>
      </body>
    </html>
  );
}
