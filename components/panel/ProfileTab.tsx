import { useRouter } from "next/router";
import { cache, memo } from "react";
import SVG from "react-inlinesvg";
import { useAsync, useAsyncRetry } from "react-use";
import useSWR from "swr";
import { ens, globalRecordKeys, provider } from "../../utils/ens";
import { resolveSocialMediaLink } from "../../utils/utils";
import { ENSFetcher, ENS_METADATA_END_POINT } from "../apis/ens";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { TabsMap } from "./IdentityPanel";
import { NFTOverview } from "./NFTOverview";
import { Poaps } from "./Poaps";

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

export const ProfileTab = (props) => {
  const { identity, toNFT } = props;
  const domain = identity.displayName || identity.identity;
  const { value: ensRecords, loading: recordsLoading } = useAsync(async () => {
    const _domain = domain.startsWith("0x")
      ? await ens.getName(domain)
      : domain;
    if (!_domain) return;
    if (localStorage.getItem("ensrecords")) {
      const cached = JSON.parse(localStorage.getItem("ensrecords"));
      if (new Date().getTime() - cached.date <= 600000) {
        return cached.value;
      }
    }

    await ens.setProvider(provider);
    const batched = await ens.batch(
      ens.getText.batch(_domain, "description"),
      ens.getText.batch(_domain, "url"),
      ens.getText.batch(_domain, "com.github"),
      ens.getText.batch(_domain, "com.twitter"),
      ens.getText.batch(_domain, "org.telegram"),
      ens.getText.batch(_domain, "com.discord"),
      ens.getText.batch(_domain, "com.reddit")
    );
    if (!batched[2]) batched[2] = await ens.getText(_domain, "vnd.github");
    if (!batched[3]) batched[3] = await ens.getText(_domain, "vnd.twitter");
    localStorage.setItem(
      "ensrecords",
      JSON.stringify({
        value: batched,
        date: new Date().getTime(),
      })
    );
    return batched;
  });

  console.log(ensRecords, "records");
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
            {(ensRecords &&
              globalRecordKeys.map((x, idx) => {
                if (idx === 0) return null;
                return (
                  ensRecords[idx] && (
                    <a
                      key={idx}
                      className="form-button btn"
                      style={{ position: "relative" }}
                      target="_blank"
                      rel="noreferrer"
                      href={openSocialMediaLink(
                        ensRecords[idx],
                        socialButtonMapping[x].type
                      )}
                    >
                      <SVG
                        src={socialButtonMapping[x].icon}
                        width={24}
                        height={24}
                        className="icon"
                      />
                    </a>
                  )
                );
              })) ||
              null}
          </div>
        </div>
      )}

      <div className="profile-subTitle">COLLECTIONS</div>
      <div className="profile-sub-container">
        <NFTOverview identity={identity} toNFT={toNFT} />
      </div>
      <div className="profile-subTitle">POAPS</div>
      <div className="profile-sub-container">
        <Poaps identity={identity} />
      </div>
    </div>
  );
};
