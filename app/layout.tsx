import { Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import ApolloProvider from "@/components/shared/ApolloProvider";
import ReduxProvider from "@/components/shared/ReduxProvider";
import { baseURL } from "@/components/utils/api";
import "../styles/web3bio.scss";
import "@rainbow-me/rainbowkit/styles.css";

const WalletProvider = lazy(() => import("@/components/shared/WalletProvider"));
const GoogleAnalytics = dynamic(
  () => import("@/components/shared/GoogleAnalytics"),
  { ssr: false }
);

export function generateMetadata() {
  const defaultTitle =
    "Web3.bio - Web3 Identity Graph Search and Link in Bio Profile";
  const description =
    "Web3.bio is a platform for Web3 and Web 2.0 Identity Graph search and link in bio profiles. It provides a list of relevant identities when searching for a Twitter handle, Ethereum address, ENS domain, Lens profile, Farcaster account, Unstoppable Domains, and other Web3 identities.";

  return {
    metadataBase: new URL(baseURL),
    title: {
      default: defaultTitle,
      template: "%s - Web3.bio",
    },
    description,
    robots: "index, follow",
    verification: {
      google: "iaUpA0X2l6UNb8C38RvUe4i_DOMvo5Ciqvf6MtYjzPs",
    },
    alternates: {
      canonical: `/`,
    },
    keywords: [
      "Web3", "Web3.bio", "Web3 DID", "Web3 Onchain Identity", "Web3 Identity Search",
      "Web3 Identity Resolver", "Web3 Identity Graph", "Web3 Social Graph",
      "Web3 Identity Explorer", "Web3 Onchain Profile", "Web3 Profile Explorer", "DID",
      "DID Search Engine", "DID Explorer", "Web3 Domain Search",
      "Web3 Domain Explorer", "Web3 Domain WHOIS",
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
      card: "summary_large_image",
      title: {
        default: defaultTitle,
        template: "%s - Web3.bio",
      },
      description,
      site: "@web3bio",
      creator: "@web3bio",
    },
    icons: {
      icon: '/favicon.ico',
    },
  }
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      </head>
      <body>
        <ReduxProvider>
          <ApolloProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <WalletProvider>
                <main>
                  {children}
                  <Toaster />
                </main>
              </WalletProvider>
            </Suspense>
          </ApolloProvider>
        </ReduxProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}

export const runtime = "edge";