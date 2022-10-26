import { memo } from "react";
import SVG from "react-inlinesvg";
import { NFTCollections } from "./NFTCollections";
import { Poaps } from "./Poaps";

const RenderProfileTab = (props) => {
  const {address} = props
  
  return (
    <div>
      <div className="profile-description">
        sujiyan.eth founder of @realmasknetwork $Mask; maintain mstdn.jp
        mastodon.cloud ; Engineer; Journalist; FOSS/Anti996; 中文/日本語
      </div>
      <div className="records">
        <button className="form-button btn " style={{ position: "relative" }}>
          <SVG
            src="icons/icon-twitter.svg"
            width={24}
            height={24}
            className="icon"
          />
        </button>
        <button className="form-button btn " style={{ position: "relative" }}>
          <SVG
            src="icons/icon-github.svg"
            width={24}
            height={24}
            className="icon"
          />
        </button>
        <button className="form-button btn " style={{ position: "relative" }}>
          <SVG
            src="icons/social-instagram.svg"
            width={24}
            height={24}
            className="icon"
          />
        </button>
      </div>

      <NFTCollections />
      <Poaps />
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
