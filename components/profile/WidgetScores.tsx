"use client";
import { memo, useEffect, useMemo } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { WidgetDegenScore } from "./WidgetDegenScore";
import { WidgetWebacy } from "./WidgetWebacy";
import { updateScoresWidget } from "../state/widgets/action";
import { useDispatch } from "react-redux";
import { WidgetGitcoin } from "./WidgetGitcoin";
import { WidgetAirStackScores } from "./WidgetAirstackScores";

const RenderWidgetScores = ({ address, states, handle }) => {
  const dispatch = useDispatch();
  const scoresArr = useMemo(() => {
    return [
      {
        key: WidgetTypes.gitcoin,
        render: () => <WidgetGitcoin address={address} />,
      },
      {
        key: WidgetTypes.degen,
        render: () => <WidgetDegenScore address={address} />,
      },
      {
        key: WidgetTypes.airstackScores,
        render: () => <WidgetAirStackScores handle={handle} />,
      },
      {
        key: WidgetTypes.webacy,
        render: () => <WidgetWebacy address={address} />,
      },
    ];
  }, [address, handle]);
  const childWidgets = useMemo(
    () => [
      states[WidgetTypes.degen],
      states[WidgetTypes.gitcoin],
      states[WidgetTypes.airstackScores],
      states[WidgetTypes.webacy],
    ],
    [states]
  );
  useEffect(() => {
    childWidgets.forEach((x) => {
      if (x.isEmpty === false && !states[WidgetTypes.scores].loaded) {
        dispatch(
          updateScoresWidget({
            initLoading: false,
            isEmpty: false,
          })
        );
      }
    });
  }, [childWidgets, dispatch, states]);
  const loading = useMemo(() => {
    return states[WidgetTypes.scores].initLoading;
  }, [states]);

  const empty = useMemo(() => {
    return childWidgets.every((x) => x.loaded && x.isEmpty);
  }, [childWidgets]);

  return (
    !empty && (
      <div className="profile-widget-full" id={WidgetTypes.scores}>
        <div
          className={`profile-widget profile-widget-scores ${
            loading && "profile-widget-loading"
          }`}
        >
          <div className="profile-widget-header">
            <h2 className="profile-widget-title">
              <span className="emoji-large mr-2">
                {WidgetInfoMapping(WidgetTypes.scores).icon}{" "}
              </span>
              {WidgetInfoMapping(WidgetTypes.scores).title}
            </h2>
          </div>
          <div className={`widget-scores-list noscrollbar`}>
            {scoresArr?.map((x, idx) => {
              return <x.render key={idx} />;
            })}
          </div>
        </div>
      </div>
    )
  );
};

export const WidgetScores = memo(RenderWidgetScores);
