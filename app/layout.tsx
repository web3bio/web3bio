import { Toaster } from "react-hot-toast";
import ApolloProvider from "../components/shared/ApolloProvider";
import GoogleAnalytics from "../components/shared/GoogleAnalytics";
import ReduxProvider from "../components/shared/ReduxProvider";
import WalletProvider from "../components/shared/WalletProvider";
import { baseURL } from "../components/utils/queries";
import "../styles/web3bio.scss";
import "@rainbow-me/rainbowkit/styles.css";

export function generateMetadata() {
  const defaultTitle =
    "Web3.bio - Web3 Identity Graph Search and Link in Bio Profile";
  const description =
    "Web3.bio is a platform for Web3 and Web 2.0 Identity Graph search and link in bio profiles. It provides a list of relevant identities when searching for a Twitter handle, Ethereum address, ENS domain, Lens profile, Farcaster account, Unstoppable Domains, and other Web3 identities.";

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
    keywords: [
      "Web3",
      "Web3.bio",
      "Web3 DID",
      "Web3 Identity",
      "Web3 Identity Search",
      "Web3 Identity Resolver",
      "Web3 Identity Graph",
      "Web3 Social Graph",
      "Web3 Identity Explorer",
      "Web3 Profile",
      "Web3 Profile Explorer",
      "DID",
      "DID Search Engine",
      "DID Explorer",
      "Web3 Domain Search",
      "Web3 Domain Explorer",
      "Web3 Domain WHOIS",
    ],
    applicationName: "Web3.bio",
    openGraph: {
      type: "website",
      url: `/`,
      siteName: "Web3.bio",
      title: {
        default: defaultTitle,
        template: "%s - Web3.bio",
      },
      description,
    },
    twitter: {
      title: {
        default: defaultTitle,
        template: "%s - Web3.bio",
      },
      description,
      site: "@web3bio",
      creator: "@web3bio",
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <main>
          <ReduxProvider>
            <ApolloProvider>
              <WalletProvider>
                {children}
                 <Toaster />
              </WalletProvider>
            </ApolloProvider>
          </ReduxProvider>
          <GoogleAnalytics />
        </main>
      </body>
    </html>
  );
}

export const runtime = "edge";
// export const preferredRegion = ["sfo1", "hnd1"];
