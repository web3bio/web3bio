import IndexPageRender from "../components/search/IndexPage";

export async function generateMetadata({ params, searchParams }) {
  const searchTerm = searchParams?.s;
  return {
    title: searchTerm
      ? `${searchTerm} - Web3.bio`
      : "Web3.bio - Web3 Identity Graph Search and Link-in-bio Profile Service",
  };
}

export default function HomePage({}) {
  return <IndexPageRender />;
}
