import { memo, useState } from "react";
import SVG from "react-inlinesvg";
const IdentityPanelRender = (props) => {
  const { onClose } = props;
  const [activeTab,setActiveTab] = useState('profile')
  return (
    <div className="panel-container">
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
          <li className="tab-item">
            <a href="#">Profile</a>
          </li>
          <li className="tab-item">
            <a href="#">NFTs</a>
          </li>
          <li className="tab-item">
            <a href="#">Feeds</a>
          </li>
        </ul>
      </div>

      <div className="panel-body">
        222
      </div>
    </div>
  );
};

export const IdentityPanel = memo(IdentityPanelRender);
