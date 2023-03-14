import { memo } from "react";
import SVG from "react-inlinesvg";
import { globalLensAttributesKeys } from "../../../../utils/lens";
import { resolveSocialMediaLink } from "../../../../utils/utils";
const traitsButtonMapping = {
  ["website"]: {
    icon: "icons/icon-web.svg",
    type: "website",
  },
  ["twitter"]: {
    icon: "icons/icon-twitter.svg",
    type: "twitter",
  },
  ["app"]: {
    icon: "icons/icon-lens.svg",
    type: "app",
  },
};

const LensProfileTabRender = (props) => {
  const { profile } = props;
  const openSocialMediaLink = (url: string, type: string) => {
    let resolvedURL = "";
    if (url.startsWith("https")) {
      resolvedURL = url;
    } else {
      resolvedURL = resolveSocialMediaLink(url, type);
    }

    return resolvedURL;
  };
  return (
    <div className="profile-container">
      <div className="profile-basic">
        <div className="profile-description">
          {profile.bio || "no description"}
        </div>

        <div className="records">
          {(profile.attributes &&
            globalLensAttributesKeys.map((x, idx) => {
              const target = profile.attributes.find((i) => i.key === x);
              return (
                target && (
                  <a
                    key={idx}
                    className="action-btn btn"
                    style={{ position: "relative" }}
                    target="_blank"
                    rel="noreferrer"
                    href={openSocialMediaLink(
                      target.value,
                      traitsButtonMapping[x].type
                    )}
                    title={x}
                  >
                    <SVG
                      src={traitsButtonMapping[x].icon}
                      width={20}
                      height={20}
                      className="icon"
                    />
                  </a>
                )
              );
            })) ||
            null}
        </div>
      </div>

      {/* <NFTOverview identity={identity} toNFT={toNFT} />
          <Poaps identity={identity} /> */}
    </div>
  );
};

export const LensProfileTab = memo(LensProfileTabRender);
