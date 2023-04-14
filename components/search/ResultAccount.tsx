import { memo, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ResultAccountItem } from "./ResultAccountItem";
import { PlatformType } from "../../utils/platform";
import { fetchProfile } from "../../api/fetchProfile";

const RenderAccount = (props) => {
  const { openGraph, resultNeighbor, graphData, openProfile } = props;
  const [renderData, setRenderData] = useState(resultNeighbor);
  useEffect(() => {
    if (!resultNeighbor || !resultNeighbor.length) return;
    const enhanceResultNeighbor = async () => {
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
    };
    enhanceResultNeighbor();
    setRenderData([...resultNeighbor]);
  }, [resultNeighbor.length, resultNeighbor]);

  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="search-result-text text-gray">
          Identity Graph results:
        </div>
        {graphData.length > 0 && (
          <div className="btn btn-link btn-sm" onClick={openGraph}>
            <SVG src={"/icons/icon-view.svg"} width={20} height={20} />{" "}
            Visualize
          </div>
        )}
      </div>
      <div className="search-result-body">
        {renderData.length > 0 ? (
          <>
            {renderData.map((avatar) => (
              <ResultAccountItem
                onItemClick={openProfile}
                identity={avatar.identity}
                sources={avatar.sources}
                profile={avatar.identity.profile}
                key={avatar.identity.uuid + avatar.identity.profile?.owner}
              />
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

export const ResultAccount = memo(RenderAccount);
