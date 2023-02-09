import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { getEnumAsArray } from "../../utils/utils";
import { formatText } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { LensProfileTab } from "./lensTabs/LensProfileTab";
import { FeedsTab } from "./FeedsTab";
import { PlatformType } from "../../utils/type";
import { NFTsTab } from "./NFTsTab";

export const TabsMap = {
  profile: {
    key: "profile",
    name: "Profile",
  },
  feeds: {
    key: "feeds",
    name: "Feeds",
  },
  nfts: {
    key: "nfts",
    name: "NFTs",
  },
};
const resolveMediaURL = (asset) => {
  if (asset) {
    return asset.startsWith("data:", "https:") ? asset : resolveIPFS_URL(asset);
  }
  return "";
};

const LensProfilePanelRender = (props) => {
  const {
    profile,
    asComponent,
    onClose,
    onTabChange,
    nftDialogOpen,
    onCloseNFTDialog,
    onShowNFTDialog,
  } = props;
  const [activeTab, setActiveTab] = useState(TabsMap.profile.key);
  const [copied, setCopied] = useState(null);
  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  const renderContent = () => {
    return (
      {
        [TabsMap.profile.key]: <LensProfileTab profile={profile} />,
        [TabsMap.feeds.key]: (
          <FeedsTab network={PlatformType.lens} identity={profile} />
        ),
        [TabsMap.nfts.key]: (
          <NFTsTab
            showDialog={onShowNFTDialog}
            closeDialog={onCloseNFTDialog}
            dialogOpen={nftDialogOpen}
            onShowDetail={resolveOnShowDetail}
            identity={profile}
            network={PlatformType.lens}
          />
        ),
      }[activeTab] || <LensProfileTab profile={profile} />
    );
  };
  const resolveOnShowDetail = (asset) => {
    // todo: to resolve url && nft dialog
  };
  return (
    <div className="identity-panel">
      <div className="panel-container">
        <div className="panel-header">
          <div className="social">
            <div className="identity-avatar">
              <NFTAssetPlayer
                src={resolveMediaURL(profile.coverPicture.original.url || "")}
                alt={
                  profile.handle
                    ? profile.handle || profile.name
                    : formatText(profile.ownedBy)
                }
              />
            </div>
            <div className="identity-content content">
              <div className="content-title text-bold">
                {profile.handle
                  ? profile.handle || profile.name
                  : formatText(profile.ownedBy)}
              </div>
              <div className="content-subtitle text-gray">
                <div className="address hide-xs">{profile.ownedBy}</div>
                <div className="address show-xs">
                  {formatText(profile.ownedBy)}
                </div>
                <Clipboard
                  component="div"
                  className="action"
                  data-clipboard-text={profile.ownedBy}
                  onSuccess={onCopySuccess}
                >
                  <SVG src="icons/icon-copy.svg" width={20} height={20} />
                  {copied && <div className="tooltip-copy">COPIED</div>}
                </Clipboard>
              </div>
            </div>
          </div>
          {asComponent && (
            <div
              className="btn btn-link btn-close"
              onClick={() => {
                localStorage.removeItem("feeds");
                onClose();
              }}
            >
              <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
            </div>
          )}
          <ul className="panel-tab">
            {getEnumAsArray(TabsMap).map((x, idx) => {
              return (
                <li
                  key={idx}
                  className={
                    activeTab === x.value.key ? "tab-item active" : "tab-item"
                  }
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(x.value.key);
                      localStorage.removeItem("feeds");
                      if (!onTabChange) return;
                      onTabChange(x.value.key);
                    }}
                  >
                    {x.value.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="panel-body">{renderContent()}</div>
      </div>
    </div>
  );
};

export const LensProfilePanel = memo(LensProfilePanelRender);
