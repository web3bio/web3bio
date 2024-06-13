import { memo, useMemo } from "react";
import { ActionStructMapping } from "../utils/activity";
import RenderProfileBadge from "./RenderProfileBadge";
import { RenderToken } from "../feed/RenderToken";

function RenderFeedActionCard(props) {
  const { actions, id, owner, openModal, network } = props;
  const renderData = useMemo(() => {
    return actions.map((x) => ({ ...ActionStructMapping(x, owner) }));
  }, [actions, owner]);

  return (
    <div className="feed-item-body" key={id}>
      {renderData.map((x, idx) => {
        const { verb, objects, prep, target, platform, details } = x;
        console.log(objects, "kkk");
        return (
          verb && (
            <div className="feed-content" key={"content_" + id + idx}>
              {verb}
              {objects
                .filter((i) => !!i)
                .map((i, idx) =>
                  typeof i === "string" ? (
                    i
                  ) : (
                    <RenderToken
                      key={`${id + idx}_${x.name || x.symbol}_${x.value}`}
                      name={i.name}
                      symbol={i.symbol}
                      image={i.image}
                      network={network}
                      openModal={openModal}
                      standard={i.standard}
                      value={{
                        value: i.value,
                        decimals: i.decimals,
                      }}
                      asset={i}
                    />
                  )
                )}
              {prep && prep}
              {target && <RenderProfileBadge identity={target} remoteFetch />}
              {platform && <> on {platform}</>}
            </div>
          )
        );
      })}
    </div>
  );
}

export default memo(RenderFeedActionCard);
