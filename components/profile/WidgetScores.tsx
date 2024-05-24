"use client";
import { memo, useMemo } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { WidgetWalletLabels } from "./WidgetWalletLabels";
import { WidgetDegenScore } from "./WidgetDegenScore";
import { WidgetWebacy } from "./WidgetWebacy";

const RenderWidgetScores = ({ address }) => {
  const scoresArr = useMemo(() => {
    return [
      {
        key: WidgetTypes.degen,
        render: () => <WidgetDegenScore address={address} />,
      },
      {
        key: WidgetTypes.webacy,
        render: () => <WidgetWebacy address={address} />,
      },
      {
        key: WidgetTypes.walletLabels,
        render: () => <WidgetWalletLabels address={address} />,
      },
    ];
  }, [address]);

  return (
    <div className="profile-widget-full" id={WidgetTypes.scores}>
      <div className="profile-widget profile-widget-rss">
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">
              {WidgetInfoMapping(WidgetTypes.scores).icon}{" "}
            </span>
            {WidgetInfoMapping(WidgetTypes.scores).title}
          </h2>
        </div>

        <div className="widget-rss-list noscrollbar">
          {scoresArr?.map((x, idx) => {
            return <x.render key={idx} />;
          })}
        </div>
      </div>
    </div>
  );
};

export const WidgetScores = memo(RenderWidgetScores);
