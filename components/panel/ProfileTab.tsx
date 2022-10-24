import { memo } from "react";
import SVG from "react-inlinesvg";
import { NFTCollections } from "./NFTCollections";

const RenderProfileTab = () => {
  return (
    <div>
      <div className="profile-description">
        sujiyan.eth founder of @realmasknetwork $Mask; maintain mstdn.jp
        mastodon.cloud ; Engineer; Journalist; FOSS/Anti996; 中文/日本語
      </div>
      <div className="records">
        <div className="record-item">
          <SVG
            className="record-item-img"
            src="icons/icon-twitter.svg"
            width={24}
            height={24}
          />
        </div>
      </div>

      <NFTCollections />
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
