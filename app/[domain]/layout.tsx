export default function DomainLayout({ children }) {
  return (
    <div
      className="web3-profile container grid-2x"
      itemType="https://schema.org/ProfilePage"
      itemScope
    >
      {children}
    </div>
  );
}

export const runtime = "edge";
