import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";

export const HomeFeatures = () => {
  return (
    <div className="home-features">
      {/* <div className="container grid-sm">
        <h3 className="home-title">
          Explore Web3 
          <div className="home-label-pride">
            <SVG
              fill={"#121212"}
              src={SocialPlatformMapping(PlatformType.farcaster).icon || ""}
              width={32}
              height={32}
              className="icon"
            />
            <SVG
              fill={"#121212"}
              src={SocialPlatformMapping(PlatformType.lens).icon || ""}
              width={32}
              height={32}
              className="icon"
            />
            identities
          </div>
           and 
          <div className="home-label-pride">
            <SVG
              fill={"#121212"}
              src={SocialPlatformMapping(PlatformType.ens).icon || ""}
              width={32}
              height={32}
              className="icon"
            />
            <SVG
              fill={"#121212"}
              src={SocialPlatformMapping(PlatformType.unstoppableDomains).icon || ""}
              width={32}
              height={32}
              className="icon"
            />
            <SVG
              fill={"#121212"}
              src={SocialPlatformMapping(PlatformType.dotbit).icon || ""}
              width={32}
              height={32}
              className="icon"
            />
            domains
          </div>
          in a whole new way</h3>
      </div> */}
      <div className="container grid-lg">
        <div className="columns mt-4 mb-4">
          <div className="column col-6 col-sm-12 mt-2 mb-2">
            <div className="card-feature">
              <div className="feature-header">
                <h3>Identity Search Support</h3>
                <h4>
                  Search for Web3 identities with these{" "}
                  <strong>domains and accounts</strong>.
                </h4>
              </div>

              <div className="feature-body feature-body-first">
                <div
                  className="identity identity-ens"
                  title="ENS domains (.eth)"
                >
                  <SVG
                    fill={SocialPlatformMapping(PlatformType.ens).color}
                    src="icons/icon-ens.svg"
                    width={20}
                    height={20}
                    className="icon mr-1"
                  />{" "}
                  Ethereum Name Service
                </div>
                <div
                  className="identity identity-farcaster"
                  title="Farcaster identities"
                >
                  <SVG
                    fill={SocialPlatformMapping(PlatformType.farcaster).color}
                    src="icons/icon-farcaster.svg"
                    width={20}
                    height={20}
                    className="icon mr-1"
                  />{" "}
                  Farcaster
                </div>
                <div
                  className="identity identity-lens"
                  title="Lens identities (.lens)"
                >
                  <SVG
                    fill={SocialPlatformMapping(PlatformType.lens).color}
                    src="icons/icon-lens.svg"
                    width={20}
                    height={20}
                    className="icon mr-1"
                  />
                  Lens
                </div>
                <div
                  className="identity identity-unstoppabledomains"
                  title="Unstoppable Domains"
                >
                  <SVG
                    fill={
                      SocialPlatformMapping(PlatformType.unstoppableDomains)
                        .color
                    }
                    src="icons/icon-unstoppabledomains.svg"
                    width={20}
                    height={20}
                    className="icon mr-1"
                  />
                  Unstoppable Domains
                </div>
                <div
                  className="identity identity-spaceid"
                  title="SPACE ID domains"
                >
                  <SVG
                    fill={SocialPlatformMapping(PlatformType.space_id).color}
                    src="icons/icon-spaceid.svg"
                    width={20}
                    height={20}
                    className="icon mr-1"
                  />{" "}
                  SPACE ID
                </div>
              </div>
            </div>
          </div>
          <div className="column col-6 col-sm-12 mt-2 mb-2">
            <div className="card-feature">
              <div className="feature-header">
                <h3>Visualize Identity Graph</h3>
                <h4>
                  Deep dive into Web3 identities and connections across digital
                  space.
                </h4>
              </div>
              <div className="feature-body feature-body-graph">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="btn">
                  <SVG
                    src={"/icons/icon-view.svg"}
                    width={24}
                    height={24}
                    className="icon mr-1"
                  />{" "}
                  Visualize
                </div>
              </div>
            </div>
          </div>
          <div className="column col-6 col-sm-12 mt-2 mb-2">
            <div className="card-feature">
              <div className="feature-header">
                <h3>Web3 Link in Bio Profile </h3>
                <h4>
                  One page to show who you are and everything you make and own.
                </h4>
                <a
                  className="text-small label mb-4"
                  href="https://web3.bio/vitalik.eth"
                  target="_blank"
                >
                  web3.bio/
                  <span className="text-small label label-primary ml-1">
                    vitalik.eth
                  </span>
                </a>
              </div>
              <div className="feature-body feature-body-profile text-center">
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-1">🦄</div>
                </div>
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-2">👨‍🌾</div>
                </div>
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-3">👩‍🎨</div>
                </div>
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-4">🧑‍🚀</div>
                </div>
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-5">🐳</div>
                </div>
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-6">🦸‍♂️</div>
                </div>
                <div className="demo-profile">
                  <div className="avatar avatar-lg avatar-7">👨‍💻</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
