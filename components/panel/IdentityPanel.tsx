import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import Clipboard from "react-clipboard.js";
import { getEnumAsArray } from "../../utils/utils";
import { FeedsTab } from "./FeedsTab";
import { NFTsTab } from "./NFTsTab";
import { ProfileTab } from "./ProfileTab";
import { useAsync } from "react-use";
import { ens } from "../../utils/ens";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { Loading } from "../shared/Loading";
import { formatText } from "../../utils/utils";
import { resolveIPFS_URL } from "../../utils/ipfs";

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

const IdentityPanelRender = (props) => {
  const { onClose, identity, onTabChange, curTab } = props;
  const [activeTab, setActiveTab] = useState(curTab || TabsMap.profile.key);
  const [curAsset, setCurAsset] = useState(null);
  const [copied, setCopied] = useState(null);

  const { value: avatar, loading: avatarLoading } = useAsync(async () => {
    return await ens.name(identity.displayName).getText("avatar");
  });
  const onCopySuccess = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const resolveMediaURL = (asset) => {
    if (asset) {
      return asset.startsWith('data:', 'https:') ? asset : resolveIPFS_URL(asset);
    }
    return '';
  };

  const renderContent = () => {
    return {
      [TabsMap.profile.key]: <ProfileTab identity={identity} />,
      [TabsMap.feeds.key]: <FeedsTab identity={identity} />,
      [TabsMap.nfts.key]: (
        <NFTsTab
          defaultOpen={!!curAsset}
          onShowDetail={resolveOnShowDetail}
          identity={identity}
        />
      ),
    }[activeTab];
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
              {avatarLoading ? (
                <Loading />
              ) : (
                <NFTAssetPlayer
                  src={resolveMediaURL(avatar)}
                  alt={identity.displayName
                    ? identity.displayName
                    : formatText(identity.identity)}
                />
              )}
            </div>
            <div className="identity-content content">
              <div className="content-title text-bold">
                {identity.displayName
                  ? identity.displayName
                  : formatText(identity.identity)}
              </div>
              <div className="content-subtitle text-gray">
                <div className="address hide-xs">{identity.identity}</div>
                <div className="address show-xs">
                  {formatText(identity.identity)}
                </div>
                <Clipboard
                  component="div"
                  className="action"
                  data-clipboard-text={identity.identity}
                  onSuccess={onCopySuccess}
                >
                  <SVG src="icons/icon-copy.svg" width={20} height={20} />
                  {copied && <div className="tooltip-copy">COPIED</div>}
                </Clipboard>
              </div>
            </div>
          </div>
          <div className="btn btn-link btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
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

export const IdentityPanel = memo(IdentityPanelRender);
