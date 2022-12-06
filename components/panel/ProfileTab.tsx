import { memo } from "react";
import SVG from "react-inlinesvg";
import { useAsync } from "react-use";
import useSWR from "swr";
import { ens, globalRecordKeys } from "../../utils/ens";
import { resolveSocialMediaLink } from "../../utils/utils";
import { ENSFetcher, ENS_METADATA_END_POINT } from "../apis/ens";
import { Loading } from "../shared/Loading";
import { NFTOverview } from "./NFTOverview";
import { Poaps } from "./Poaps";

interface ENSRecords {
  [index: string]: string;
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

export function useProfile(domain: string) {
  const { data, error } = useSWR<any>(
    ENS_METADATA_END_POINT + `/${domain}/meta`,
    ENSFetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

const RenderProfileTab = (props) => {
  const { identity } = props;

  const {
    data: profileData,
    isError,
    isLoading: profileLoading,
  } = useProfile(identity.displayName);
  const { value: ensRecords, loading: ensLoading } = useAsync(async () => {
    const ensInstance = ens.name(identity.displayName);
    const obj: ENSRecords = {};
    for (let i = 0; i < globalRecordKeys.length; i++) {
      const value = globalRecordKeys[i];
      obj[globalRecordKeys[i]] = await ensInstance.getText(value);
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
  console.log(profileData, "hhh", ensRecords);
  return (
    <div className="profile-container">
      {(profileData || ensRecords) && (
        <div className="profile-basic">
          <div className="profile-description">
            {profileData.description ?? "no description"}
          </div>

          <div className="records">
            {ensLoading ? (
              <Loading />
            ) : ensRecords ? (
              Object.keys(socialButtonMapping).map((x, idx) => {
                return (
                  ensRecords[x] && (
                    <button
                      key={idx}
                      className="form-button btn"
                      style={{ position: "relative" }}
                      onClick={() => {
                        openSocialMediaLink(
                          ensRecords[x],
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
              })
            ) : null}
          </div>
        </div>
      )}

      <NFTOverview identity={identity} />
      <Poaps identity={identity} />
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
