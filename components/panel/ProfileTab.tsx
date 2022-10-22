import { memo } from "react";

const RenderProfileTab = () => {
  return (
    <div>
      <div className="profile-description">
        sujiyan.eth founder of @realmasknetwork $Mask; maintain mstdn.jp
        mastodon.cloud ; Engineer; Journalist; FOSS/Anti996; 中文/日本語
      </div>
      <div className="records">
        <div className="record-item">222</div>
      </div>
    </div>
  );
};

export const ProfileTab = memo(RenderProfileTab);
