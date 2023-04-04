import { useState } from "react";
import SVG from "react-inlinesvg";
import { useAsync } from "react-use";
import useSWR from "swr";
import { ens, globalRecordKeys, provider } from "../../utils/domains";
import { PlatformType } from "../../utils/type";
import { isValidAddress, resolveSocialMediaLink } from "../../utils/utils";
import { ENSFetcher, ENS_METADATA_END_POINT } from "../apis/ens";
import { Loading } from "../shared/Loading";
import { NFTDialog, NFTDialogType } from "./components/NFTDialog";
import { NFTOverview } from "./components/NFTOverview";
import { Poaps } from "./components/Poaps";

const socialButtonMapping = {
  ["com.github"]: {
    icon: "icons/icon-github.svg",
    type: PlatformType.github,
  },
  ["com.twitter"]: {
    icon: "icons/icon-twitter.svg",
    type: PlatformType.twitter,
  },
  ["vnd.github"]: {
    icon: "icons/icon-github.svg",
    type: PlatformType.github,
  },
  ["vnd.twitter"]: {
    icon: "icons/icon-twitter.svg",
    type: PlatformType.twitter,
  },
  ["com.instagram"]: {
    icon: "icons/icon-instagram.svg",
    type: PlatformType.instagram,
  },
  ["com.discord"]: {
    icon: "icons/icon-discord.svg",
    type: PlatformType.discord,
  },
  ["com.reddit"]: {
    icon: "icons/icon-reddit.svg",
    type: PlatformType.reddit,
  },
  ["org.telegram"]: {
    icon: "icons/icon-telegram.svg",
    type: PlatformType.telegram,
  },
  ["url"]: {
    icon: "icons/icon-web.svg",
    type: PlatformType.url,
  },
};

export function useProfile(domain: string, initialData) {
  const { data, error } = useSWR<any>(
    ENS_METADATA_END_POINT + `/${domain}/meta`,
    ENSFetcher,
    {
      fallbackData: initialData,
    }
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export const ProfileTab = (props) => {
  const { identity, toNFT, network, poaps, prefetchingCollections } = props;
  const domain = identity.displayName || identity.identity;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPoap, setCurrentPoap] = useState(null);
  const { value: ensRecords, loading: recordsLoading } = useAsync(async () => {
    const _domain = isValidAddress(domain) ? await ens.getName(domain) : domain;

    if (!_domain) return;
    if (localStorage.getItem(`ens_${domain}`)) {
      const cached = JSON.parse(localStorage.getItem(`ens_${domain}`));
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
      `ens_${domain}`,
      JSON.stringify({
        value: batched,
        date: new Date().getTime(),
      })
    );
    return batched;
  });

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

          <div>Loading Records...</div>
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
                      className="action-btn btn"
                      style={{ position: "relative" }}
                      target="_blank"
                      rel="noreferrer"
                      href={openSocialMediaLink(
                        ensRecords[idx],
                        socialButtonMapping[x].type
                      )}
                      title={x}
                    >
                      <SVG
                        src={socialButtonMapping[x].icon}
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
      )}

      <NFTOverview
        initialData={prefetchingCollections}
        identity={identity}
        toNFT={toNFT}
      />

      <Poaps
        onShowDetail={(poap) => {
          setCurrentPoap(poap);
          setDialogOpen(true);
        }}
        initialData={poaps}
        identity={identity}
      />

      {dialogOpen && currentPoap && (
        <NFTDialog
          address={currentPoap.address}
          tokenId={currentPoap.tokenId}
          network={network}
          poap={currentPoap}
          open={dialogOpen}
          type={NFTDialogType.POAP}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};
