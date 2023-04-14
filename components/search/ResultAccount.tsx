import { memo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import { PlatformType } from "../../utils/platform";
import { fetchProfile } from "../../api/fetchProfile";
import { Loading } from "../shared/Loading";
import { ResultGraph } from "../graph/ResultGraph";
import _ from "lodash";

const RenderAccount = (props) => {
  const { graphData, resultNeighbor, openProfile, graphTitle } = props;
  const [renderData, setRenderData] = useState(resultNeighbor);

  const [open, setOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!resultNeighbor || !resultNeighbor.length) return;
    const enhanceResultNeighbor = async () => {
      try {
        setProfileLoading(true);
        for (let i = 0; i < resultNeighbor.length; i++) {
          const item = resultNeighbor[i];
          if (
            [
              PlatformType.twitter,
              PlatformType.ethereum,
              PlatformType.farcaster,
              PlatformType.dotbit,
              PlatformType.lens,
            ].includes(item.identity.platform)
          ) {
            item.identity = {
              ...item.identity,
              profile: await fetchProfile(item.identity),
            };
          }
        }
      } catch (e) {
        console.error("search Item fetch Profile", e);
      } finally {
        setRenderData([...resultNeighbor]);
        setProfileLoading(false);
      }
    };

    enhanceResultNeighbor();
  }, [resultNeighbor.length, resultNeighbor, graphData]);

  const resolvedGraphData = graphData.reduce((pre, cur) => {
    pre.push({
      ...cur,
      to: {
        ...cur.to,
        profile: _.find(renderData, (i) => i.identity.uuid == cur.to.uuid)
          ?.identity.profile,
      },
      from: {
        ...cur.from,
        profile: _.find(renderData, (i) => i.identity.uuid == cur.from.uuid)
          ?.identity.profile,
      },
    });
    return pre;
  }, []);

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
          {profileLoading ? (
            <Loading placeholder="Waiting from Web5.bio Profile API..." styles={{ margin: 16 }} />
          ) : renderData.length > 0 ? (
            <>
              {renderData.map((avatar) => (
                <ResultAccountItem
                  onItemClick={openProfile}
                  identity={avatar.identity}
                  sources={avatar.sources}
                  profile={avatar.identity.profile}
                  key={avatar.identity.uuid}
                />
              ))}
            </>
          ) : null}
        </div>
      </div>
      {open && (
        <ResultGraph
          onClose={() => setOpen(false)}
          data={resolvedGraphData}
          title={graphTitle}
        />
      )}
    </>
  );
};

export const ResultAccount = memo(RenderAccount);
