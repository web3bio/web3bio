import { useMemo } from "react";
import { ActionStructMapping } from "../utils/activity";
import RenderProfileBadge from "./RenderProfileBadge";
import { RenderToken } from "../feed/RenderToken";

export default function FeedActionCard(props) {
  const { actions, id, owner } = props;
  console.log(actions,'kkk')
  const renderData = useMemo(() => {
    return actions.map((x) => ({ ...ActionStructMapping(x, owner) }));
  }, [actions, owner]);

  return (
    <div className="feed-item-body" key={id}>
      {renderData.map((x) => {
        const { verb, objects, prep, target, platform, details } = x;
        return (
          verb && (
            <div className="feed-content" key={"content_" + id}>
              {verb}
              {objects.map((i, idx) => (
                <RenderToken
                  key={`${id + idx}_${x.name || x.symbol}_${x.value}`}
                  name={i.name}
                  symbol={i.symbol}
                  image={i.image}
                  standard={i.standard}
                  value={{
                    value: i.value,
                    decimals: i.decimals,
                  }}
                />
              ))}
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
