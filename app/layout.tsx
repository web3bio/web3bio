import "../styles/web3bio.scss";
import { headers } from "next/headers";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = headers();
  const domain = headerList.get("host") || "";
  const fullUrl = headerList.get("referer") || "";
  const [, pathname] =
    fullUrl.match(new RegExp(`https?:\/\/${domain}(.*)`)) || [];
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://web3.bio/";
  return {
    metadataBase: new URL(baseURL),
    viewport: {
      width: "device-width",
      initialScale: 1,
      viewportFit: "auto",
    },
    robots: "index, follow",
    verification: {
      google: "iaUpA0X2l6UNb8C38RvUe4i_DOMvo5Ciqvf6MtYjzPs",
    },
    title:
      "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
    description:
      "Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities.",
    alternates: {
      canonical: `${baseURL}${pathname || ""}`,
    },
    openGraph: {
      type: "website",
      url: `${baseURL}${pathname || ""}`,
      siteName: "Web3.bio",
      title:
        "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
      description:
        "Web3.bio (Previously Web5.bio) is a Web3 and Web 2.0 Identity Graph search and link in bio profile platform. Web3.bio will provide a list of relevant identities when you are searching any Twitter handle, Ethereum address, ENS domain, Lens profile or Unstoppable Domains, and other Web3 identities.",
      images: [
        {
          url: `${baseURL}/img/web3bio-social.jpg`,
        },
      ],
    },
  };
}
export default function RootLayout({ children, modal }) {
  return (
    <html>
      <body>
        <main>
          {children}
          {modal}
        </main>
      </body>
    </html>
  );
}
