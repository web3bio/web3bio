import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import { getEnumAsArray } from "../../utils/utils";
import { FeedsTab } from "./FeedsTab";
import { NFTsTab } from "./NFTsTab";
import { ProfileTab } from "./ProfileTab";

enum TabsMap {
  profile = "Profile",
  nfts = "NFTs",
  feeds = "Feeds",
}

const IdentityPanelRender = (props) => {
  const { onClose } = props;
  const [activeTab, setActiveTab] = useState(TabsMap.profile);
  const renderContent = () => {
    return {
      [TabsMap.profile]: <ProfileTab />,
      [TabsMap.nfts]: <NFTsTab />,
      [TabsMap.feeds]: <FeedsTab />,
    }[activeTab];
  };
  return (
    <div className={"panel-container"}>
      <div className="close-icon-box" onClick={onClose}>
        <SVG className="close-icon" src="icons/icon-close.svg" />
      </div>
      <div className="panel-identity-basic">
        <div className="identity-avatar-container">
          <img
            src="https://pbs.twimg.com/profile_images/1582110337569935362/xrMkOl7h_400x400.jpg"
            alt=""
          />
        </div>
        <div className="identity-basic-info">
          <div className="displayName">sujiyan.eth</div>
          <div className="identity">
            0x983110309620D911731Ac0932219af06091b6744
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
