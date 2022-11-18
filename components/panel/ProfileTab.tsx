import { memo } from "react";
import SVG from "react-inlinesvg";
import { useAsync } from "react-use";
import { ens, globalRecordKeys } from "../../utils/ens";
import { resolveSocialMediaLink } from "../../utils/utils";
import { Loading } from "../shared/Loading";
import { NFTOverview } from "./NFTOverview";
import { Poaps } from "./Poaps";

interface ENSRecords {
  base: {
    [index: string]: string;
  };
  socialMedia: {
    [index: string]: string;
  };
}

const socialButtonMapping = {
  ["com.github"]: {
    icon: "icons/icon-github.svg",
    type: "github",
  },
  ["com.twitter"]: {
    icon: "icons/icon-twitter.svg",
    type: "twitter",
  },
  ["com.discord"]: {
    icon: "icons/social-discord.svg",
    type: "discord",
  },
  ["com.reddit"]: {
    icon: "icons/social-reddit.svg",
    type: "reddit",
  },
  ["com.telegram"]: {
    icon: "icons/social-telegram",
    type: "telegram",
  },
};

const RenderProfileTab = (props) => {
  const { identity } = props;

  const { value: ensRecords, loading: ensLoading } = useAsync(async () => {
    const ensInstance = ens.name(identity.displayName);
    const obj: ENSRecords = {
      base: {},
      socialMedia: {},
    };
    for (let i = 0; i < globalRecordKeys.base.length; i++) {
      const value = globalRecordKeys.base[i];
      obj.base[globalRecordKeys.base[i]] = await ensInstance.getText(value);
    }
    for (let i = 0; i < globalRecordKeys.socialMedia.length; i++) {
      const value = globalRecordKeys.socialMedia[i];
      obj.socialMedia[globalRecordKeys.socialMedia[i]] =
        await ensInstance.getText(value);
    }
    return obj;
  });

  const openSocialMediaLink = (url: string, type: string) => {
    let resolvedURL = "";
    if (url.startsWith("https")) {
      resolvedURL = url;
    } else {
      resolvedURL = resolveSocialMediaLink(url, type);
    }

    window.open(resolvedURL, "_blank");
  };

  return (
    <div className="profile-container">
      {ensLoading || !ensRecords ? (
        <div className="profile-basic-info-loading">
          <Loading />
        </div>
      ) : (
        <div className="profile-basic-info">
          <div className="profile-description">
            {ensRecords.base.description || "no description"}
          </div>
          <div className="records">
            {Object.keys(socialButtonMapping).map((x, idx) => {
              return (
                ensRecords.socialMedia[x] && (
                  <button
                    key={idx}
                    className="form-button btn"
                    style={{ position: "relative" }}
                    onClick={() => {
                      openSocialMediaLink(
                        ensRecords.socialMedia[x],
                        socialButtonMapping[x].type
                      );
                    }}
                  >
                    <SVG
                      src={socialButtonMapping[x].icon}
                      width={24}
                      height={24}
                      className="icon"
                    />
                  </button>
                )
              );
            })}
          </div>
        </div>
      )}

      <NFTOverview identity={identity} />
      <Poaps identity={identity} />
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
