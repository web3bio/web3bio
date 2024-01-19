
export default function DomainLayout({ children }) {
  return <div className="web3-profile container grid-xl">{children}</div>;
}

export const runtime = "edge";
export const revalidate = 432000;
