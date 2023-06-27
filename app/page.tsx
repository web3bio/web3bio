import IndexPageRender from "../components/search/IndexPage";
import { Footer } from "../components/shared/Footer";

export async function generateMetadata({ params, searchParams }) {
  const searchTerm = searchParams?.s;
  return {
    title: searchTerm
      ? `${searchTerm} - Web3.bio`
      : "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
  };
}

export default function HomePage({}) {
  return (
    <>
      <div className="web3bio-container">
        <div className="web3bio-cover flare"></div>
        <IndexPageRender />;
      </div>
      <Footer />
    </>
  );
}
