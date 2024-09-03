import SVG from "react-inlinesvg";
import Link from "next/link";
import WalletButton from "./WalletButton";

export const Header = () => {
  return (
    <div className="web3bio-header">
      <div className="container grid-sm">
        <div className="header-menu">
          <Link
            href={{
              pathname: "/",
              query: {},
            }}
            className="web3bio-logo"
            title="Web3.bio"
            aria-label="Go back to home"
          >
            <h1 className="text-conic-pride">
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
          {/* <div className="header-btn">
            <a href="#search" className="btn">
              Search
            </a>
            <a href="#profile" className="btn">Profile</a>
            <a href="#profile-api" className="btn">API</a>
          </div>
          <div className="header-account">
            <a href="#" className="btn btn-primary">Connect</a>
            <WalletButton />
          </div> */}
        </div>
      </div>
    </div>
  );
};
