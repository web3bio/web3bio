import { memo, useEffect } from "react";
import SVG from "react-inlinesvg";
import { useAsync } from "react-use";
import { ens } from "../../utils/ens";


const RenderProfileTab = (props) => {
  const { identity } = props;

  const res = useAsync(async () => {
    console.log(ens,'ggg')
    return await ens.name("brantly.eth").getText('com.github');
  });
  console.log(res, "ens");

  return (
    <div className="profile-container">
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

      {/* <NFTCollections identity={identity} />
      <Poaps /> */}
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
