"use client";
import { memo, useEffect, useMemo } from "react";
import { WidgetInfoMapping, WidgetType } from "../utils/widgets";
import { WidgetDegenScore } from "./WidgetDegenScore";
import { WidgetWebacy } from "./WidgetWebacy";
import { useDispatch } from "react-redux";
import { WidgetGitcoin } from "./WidgetGitcoin";
import { updateScoresWidget } from "../state/widgets/reducer";
import { WidgetTalent } from "./WidgetTalent";

const RenderWidgetScores = ({
  profile,
  states,
  farcasterHandle,
  openModal,
}) => {
  const dispatch = useDispatch();
  const scoresArr = useMemo(() => {
    return [
      {
        key: WidgetType.gitcoin,
        render: () => <WidgetGitcoin openModal={openModal} profile={profile} />,
      },
      {
        key: WidgetType.degenscore,
        render: () => (
          <WidgetDegenScore openModal={openModal} profile={profile} />
        ),
      },
      {
        key: WidgetType.talent,
        render: () => <WidgetTalent openModal={openModal} profile={profile} />,
      },
      {
        key: WidgetType.webacy,
        render: () => <WidgetWebacy address={profile.address} />,
      },
    ];
  }, [profile.address, farcasterHandle]);
  const childWidgets = useMemo(
    () => [
      states[WidgetType.degenscore],
      states[WidgetType.gitcoin],
      states[WidgetType.talent],
      states[WidgetType.webacy],
    ],
    [states]
  );
  useEffect(() => {
    childWidgets.forEach((x) => {
      if (x.isEmpty === false && !states[WidgetType.scores].loaded) {
        dispatch(
          updateScoresWidget({
            initLoading: false,
            isEmpty: false,
          })
        );
      }
    });
  }, [childWidgets, dispatch, states]);

  const empty = childWidgets.every((x) => x.loaded && x.isEmpty);

  return (
    !empty && (
      <div className="profile-widget-full" id={WidgetType.scores}>
        <div
          className={`profile-widget profile-widget-scores ${
            states[WidgetType.scores].initLoading && "profile-widget-loading"
          }`}
        >
          <div className="profile-widget-header">
            <h2 className="profile-widget-title">
              <span className="emoji-large mr-2">
                {WidgetInfoMapping(WidgetType.scores).icon}{" "}
              </span>
              {WidgetInfoMapping(WidgetType.scores).title}
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

export default memo(RenderWidgetScores);
