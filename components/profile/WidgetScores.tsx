"use client";
import { memo, useEffect, useMemo } from "react";
import { WidgetInfoMapping, WidgetTypes } from "../utils/widgets";
import { WidgetDegenScore } from "./WidgetDegenScore";
import { WidgetWebacy } from "./WidgetWebacy";
import { updateScoresWidget } from "../state/widgets/action";
import { useDispatch } from "react-redux";

const RenderWidgetScores = ({ address, states }) => {
  const dispatch = useDispatch();
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
    ];
  }, [address]);

  useEffect(() => {
    const childs = [states[WidgetTypes.webacy], states[WidgetTypes.degen]];
    childs.forEach((x) => {
      if (x.isEmpty === false && !states[WidgetTypes.scores].loaded) {
        dispatch(
          updateScoresWidget({
            initLoading: false,
            isEmpty: false,
          })
        );
      }
    });
  }, [states, dispatch]);
  const loading = useMemo(() => {
    return states[WidgetTypes.scores].initLoading;
  }, [states]);

  const empty = useMemo(() => {
    return [states[WidgetTypes.webacy], states[WidgetTypes.degen]].every(
      (x) => x.loaded && x.isEmpty
    );
  }, [states]);

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
