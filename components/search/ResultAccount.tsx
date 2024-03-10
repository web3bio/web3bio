import { memo, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import _ from "lodash";
import { useSelector } from "react-redux";
import { AppState } from "../../state";
import { ProfileInterface } from "../../utils/profile";
import D3ResultGraph from "../graph/D3ResultGraph";
import { PlatformType } from "../../utils/platform";

const RenderAccount = (props) => {
  const { graphData, resultNeighbor, graphTitle } = props;
  const [open, setOpen] = useState(false);
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  return (
    <>
      <div className="search-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Identity Graph results:
          </div>
          {graphData.length > 0 && (
            <div className="btn btn-link btn-sm" onClick={() => setOpen(true)}>
              <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
              Visualize
            </div>
          )}
        </div>
        <div className="search-result-body">
          {resultNeighbor?.map((avatar, idx) => {
            const profile = profiles.find(
              (x) => x?.uuid === avatar.identity.uuid
            );
            const identity = avatar.identity;
            return (
              <ResultAccountItem
                resolvedIdentity={
                  [
                    PlatformType.unstoppableDomains,
                    PlatformType.dotbit,
                  ].includes(avatar.identity.platform)
                    ? identity.ownedBy.identity
                    : profile?.address || identity.identity
                }
                identity={identity}
                sources={avatar.sources}
                profile={profile}
                key={avatar.identity.uuid + idx}
              />
            );
          })}
        </div>
      </div>
      {open && (
        <D3ResultGraph
          onClose={() => setOpen(false)}
          data={graphData.reduce((pre, cur) => {
            pre.push({
              ...cur,
              to: {
                ...cur.to,
                profile: _.find(profiles, (i) => i.uuid == cur.to.uuid),
              },
              from: {
                ...cur.from,
                profile: _.find(profiles, (i) => i.uuid == cur.from.uuid),
              },
            });
            return pre;
          }, [])}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
