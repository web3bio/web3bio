import SVG from "react-inlinesvg";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { colorMod } from "../utils/utils";

export const HomeFeatures = () => {
  return (
    <div className="home-features">
      <div className="container grid-sm">
        <h3 className="home-title">
          <span>Explore{" "}</span><span className="text-pride text-large">✦</span><span>Web3 identities{" "}</span>
          <div className="home-title-icons">
            <div 
              className="home-title-icon"
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.ethereum)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.ethereum).color}
                src={SocialPlatformMapping(PlatformType.ethereum).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.ethereum).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.farcaster)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.farcaster).color}
                src={SocialPlatformMapping(PlatformType.farcaster).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.farcaster).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.lens)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.lens).color}
                src={SocialPlatformMapping(PlatformType.lens).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.lens).label || ""}
              />
            </div>
          </div>
          <span>and{" "}</span><span>crypto domains{" "}</span>
          <div className="home-title-icons">
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-primary-color" as string]: SocialPlatformMapping(
                  PlatformType.ens
                ).color,
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.ens)?.color,
                  65
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.ens).color}
                src={SocialPlatformMapping(PlatformType.ens).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.ens).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.unstoppableDomains)?.color,
                  65
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.unstoppableDomains).color}
                src={SocialPlatformMapping(PlatformType.unstoppableDomains).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.unstoppableDomains).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.clusters)?.color,
                  65
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.clusters).color}
                src={SocialPlatformMapping(PlatformType.clusters).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.clusters).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.crossbell)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.crossbell).color}
                src={SocialPlatformMapping(PlatformType.crossbell).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.crossbell).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.space_id)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.space_id).color}
                src={SocialPlatformMapping(PlatformType.space_id).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.space_id).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.dotbit)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.dotbit).color}
                src={SocialPlatformMapping(PlatformType.dotbit).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.dotbit).label || ""}
              />
            </div>
            <div 
              className="home-title-icon" 
              style={{
                ["--widget-bg-color" as string]: colorMod(
                  SocialPlatformMapping(PlatformType.sns)?.color,
                  75
                ),
              }}
            >
              <SVG
                fill={SocialPlatformMapping(PlatformType.sns).color}
                src={SocialPlatformMapping(PlatformType.sns).icon || ""}
                width={24}
                height={24}
                className="icon"
                title={SocialPlatformMapping(PlatformType.sns).label || ""}
              />
            </div>
          </div>
          <span>in{" "}</span><span>a{" "}</span><span>whole{" "}</span><span>new{" "}</span> <span>{" "}informative way.{" "}</span>
        </h3>  
      </div>
      <div className="container grid-sm">
        <h3 className="home-title">
          <span>This is also explorable for Web2 accounts.</span>
        </h3>
      </div>
      <div className="container grid-sm">
        <h3 className="home-subtitle">With Web3.bio you can:</h3>
      </div>
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
