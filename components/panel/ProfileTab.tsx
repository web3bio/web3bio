import { memo } from "react";
import SVG from "react-inlinesvg";
import { useAsync } from "react-use";
import useSWR from "swr";
import { ens, globalRecordKeys, provider } from "../../utils/ens";
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
  ["vnd.github"]: {
    icon: "icons/icon-github.svg",
    type: "github",
  },
  ["vnd.twitter"]: {
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
  ["org.telegram"]: {
    icon: "icons/social-telegram.svg",
    type: "telegram",
  },
  ["url"]: {
    icon: "icons/social-website.svg",
    type: "url",
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
  const domain = identity.displayName || identity.identity;

  const { value: ensRecords, loading: recordsLoading } = useAsync(async () => {
    await ens.setProvider(provider);
    const batched = await ens.batch(
      ens.getText.batch(domain, "description"),
      ens.getText.batch(domain, "url"),
      ens.getText.batch(domain, "com.github"),
      ens.getText.batch(domain, "com.twitter"),
      ens.getText.batch(domain, "org.telegram"),
      ens.getText.batch(domain, "com.discord"),
      ens.getText.batch(domain, "com.reddit")
    );
    if (!batched[2]) batched[2] = await ens.getText(domain, "vnd.github");
    if (!batched[3]) batched[3] = await ens.getText(domain, "vnd.twitter");

    return batched;
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
      {recordsLoading ? (
        <div className="profile-basic-loading-placeholder">
          <div
            style={{
              position: "relative",
              width: "1rem",
              height: "1rem",
            }}
          >
            <Loading />
          </div>

          <div>Loading Profile...</div>
        </div>
      ) : (
        <div className="profile-basic">
          <div className="profile-description">
            {(ensRecords && ensRecords[0]) || "no description"}
          </div>

          <div className="records">
            {globalRecordKeys.map((x, idx) => {
              if (idx === 0) return null;
              return (
                ensRecords[idx] && (
                  <button
                    key={idx}
                    className="form-button btn"
                    style={{ position: "relative" }}
                    onClick={() => {
                      openSocialMediaLink(
                        ensRecords[idx],
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

      <div className="profile-subTitle">COLLECTIONS</div>
      <NFTOverview identity={identity} />
      <div className="profile-subTitle">POAPS</div>
      <Poaps identity={identity} />
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
