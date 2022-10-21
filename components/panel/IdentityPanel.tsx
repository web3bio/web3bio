import { memo } from "react";
import SVG from "react-inlinesvg";
const IdentityPanelRender = (props) => {
  const { onClose } = props;
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
            <SVG className="copy-icon" src="icons/icon-copy.svg" width={16} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const IdentityPanel = memo(IdentityPanelRender);
