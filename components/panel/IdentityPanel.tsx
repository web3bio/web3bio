import Image from "next/image";
import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import { getEnumAsArray } from "../../utils/utils";
import { FeedsTab } from "./FeedsTab";
import { NFTsTab } from "./NFTsTab";

enum TabsMap {
  // profile = "Profile",
  feeds = "Feeds",
  nfts = "NFTs",
}

const IdentityPanelRender = (props) => {
  const { onClose,identity } = props;
  const [activeTab, setActiveTab] = useState(TabsMap.feeds);
  const renderContent = () => {
    return {
      [TabsMap.feeds]: <FeedsTab identity={identity} />,
      [TabsMap.nfts]: <NFTsTab identity={identity} />,
    }[activeTab];
  };
  return (
    <div className="panel-container">
      <div className="close-icon-box" onClick={onClose}>
        <SVG className="close-icon" src={"/icons/icon-close.svg"} />
      </div>
      <div className="panel-identity-basic">
        <div className="identity-avatar-container">
          <picture>
            <img
              src="https://pbs.twimg.com/profile_images/1582110337569935362/xrMkOl7h_400x400.jpg"
              alt="prifile_avatar"
            />
          </picture>
        </div>
        <div className="identity-basic-info">
          <div className="displayName">{identity.displayName}</div>
          <div className="identity">
            {identity.identity}
            <SVG
              className="copy-icon"
              src="icons/icon-copy.svg"
              width={16}
              height={16}
            />
          </div>
        </div>
      </div>
      <div className="panel-tab-contianer">
        <ul className="panel-tab">
          {getEnumAsArray(TabsMap).map((x, idx) => {
            return (
              <li
                key={idx}
                className={
                  activeTab === x.value ? "tab-item active" : "tab-item"
                }
                onClick={() => setActiveTab(x.value)}
              >
                <a href="#">{x.value}</a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="panel-body">{renderContent()}</div>
    </div>
  );
};

export const IdentityPanel = memo(IdentityPanelRender);
