import Link from "next/link";
import Head from "next/head";
import "../../styles/web3bio.scss";
import { baseURL } from "@/components/utils/queries";

export async function getStaticPaths() {
  const res = await fetch(process.env.NEXT_PUBLIC_SITEMAP_INDEX || "https://sitemaps.web3.bio/sitemap-staging.json");
  const sitemaps = await res.json();

  const paths = sitemaps.data.map((item) => ({
    params: { id: item.sitemap },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const pageId = params.id;
  const res = await fetch(
    `https://sitemaps.web3.bio/sitemaps/sitemap-${pageId}.json`
  );
  const data = await res.json();
  return { props: { data, pageId } };
}

export default function Sitemap({ data, pageId }) {
  return (
    <div className="web3bio-container">
      <Head>
        <title>Web3.bio Sitemaps - Page {pageId}</title>
        <meta
          name="description"
          content="Web3.bio is a platform for Web3 and Web 2.0 Identity Graph search and link in bio profiles. It provides a list of relevant identities when searching for a Twitter handle, Ethereum address, ENS domain, Lens profile, Farcaster account, Unstoppable Domains, and other Web3 identities."
        ></meta>
        <link rel="canonical" href={`${baseURL}/sitemaps/${pageId}`}></link>
        <meta name="robots" content="index, follow"></meta>
      </Head>
      <div className="web3bio-cover ui2"></div>
      <div className={"web3bio-search focused"}>
        <div className="container grid-sm">
          <div className="search-form">
            <Link
              href={{
                pathname: "/",
                query: {},
              }}
              className="web3bio-logo"
              title="Web3.bio"
            >
              <h1 className="text-pride">
                WEB3
                <br />
                BIO
              </h1>
              <h2 className="text-assistive">
                Web3.bio is a platform for Web3 and Web 2.0 Identity Graph
                search and link in bio profiles. It provides a list of relevant
                identities when searching for a Twitter handle, Ethereum
                address, ENS domain, Lens profile, Farcaster account,
                Unstoppable Domains, and other Web3 identities.
              </h2>
            </Link>
            <div className="form-label">
              Web3 Identity Search
              <br />
              <small>
                Explore Web3 identities and domains in a whole new way
              </small>
            </div>
          </div>
          <div className="sitemap-result">
            <div className="sitemap-result-header">
              <h1 className="sitemap-result-text text-gray">
                Sitemaps Page {pageId}
              </h1>
            </div>
            <div className="sitemap-result-body">
              {data?.data.map((page) => (
                <Link
                  href={`/${page.domain}`}
                  className={"btn btn-sm"}
                  target="_blank"
                  title={`${page.domain} Profile`}
                  key={page.domain}
                >
                  {page.domain}
                </Link>
              ))}
            </div>
            <div className="divider"></div>
            <div className="sitemap-result-footer">
              {data.prev && (
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/sitemaps/${data.prev}`}
                  title={`Previous Page`}
                >
                  Page {data.prev}
                </Link>
              )}
              {data.next && (
                <Link
                  className="btn btn-primary btn-sm"
                  href={`/sitemaps/${data.next}`}
                  title={`Next Page`}
                >
                  Page {data.next}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export const runtime = "nodejs";
