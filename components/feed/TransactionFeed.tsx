import { memo, useEffect, useRef, useState } from "react";
import { fetchProfile } from "../../hooks/api/fetchProfile";
import { useIsInViewport } from "../../hooks/useIsInViewport";
import { ActivityType } from "../../utils/activity";
import { PlatformType } from "../../utils/platform";
import { ActivityTypeMapping, debounce } from "../../utils/utils";
import { RenderToken, RenderIdentity } from "./FeedItem";
import _ from "lodash";

const RenderTransactionCard = (props) => {
  const { action, id } = props;
  const metadata = action?.metadata;
  const fetchCheckRef = useRef(null);
  const isInViewport = useIsInViewport(fetchCheckRef?.current);
  const [ctx, setCtx] = useState<any>(null);
  useEffect(() => {
    const fetchToProfile = async () => {
      const res = await fetchProfile({
        platform: PlatformType.ethereum,
        identity: action.to,
      });

      setCtx(res);
    };
    const throttled = _.throttle(fetchToProfile, 500);

    if (
      action.type === ActivityType.transfer &&
      isInViewport &&
      !ctx &&
      !ctx?.error
    ) {
      throttled();
    }
  }, [isInViewport, ctx, action, fetchCheckRef]);

  switch (action.type) {
    case ActivityType.liquidity:
      return (
        <>
          <div className="feed-content">
            {
              ActivityTypeMapping(action.type).action[
                metadata.action || "default"
              ]
            }
            &nbsp;
            {metadata.tokens.map((x) =>
              RenderToken(
                x,
                `${id}_${x.name}_${ActivityTypeMapping(action.type).prep}`
              )
            )}{" "}
            {ActivityTypeMapping(action.type).prep}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    case ActivityType.swap:
      return (
        <>
          <div className="feed-content">
            {
              ActivityTypeMapping(action.type).action[
                metadata.action || "default"
              ]
            }
            &nbsp;
            {RenderToken(metadata.from, `${id}_from_${metadata.from?.name}`)}
            &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
            {RenderToken(metadata.to, `${id}_to_${metadata.to?.name}`)}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    case ActivityType.multisig:
      return (
        <>
          <div className="feed-content">
            {
              ActivityTypeMapping(action.type).action[
                metadata.action || "default"
              ]
            }
            &nbsp;
            {RenderIdentity(metadata.owner)}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    case ActivityType.deploy:
      return (
        <>
          <div className="feed-content">
            {
              ActivityTypeMapping(action.type).action[
                metadata.action || "default"
              ]
            }
            &nbsp;
            {RenderIdentity(metadata.address)}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    default:
      return (
        <div ref={fetchCheckRef} className="feed-content">
          {
            ActivityTypeMapping(action.type).action[
              metadata.action || "default"
            ]
          }
          &nbsp;
          {RenderToken(
            metadata.token || metadata,
            `${id}_${ActivityType.transfer}_${metadata.from?.name}`
          )}
          {action.to && ActivityTypeMapping(action.type).prep && (
            <>
              &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
              {RenderIdentity(!ctx || ctx.error ? action.to : ctx, action.type)}
            </>
          )}
          {action.platform && (
            <span className="feed-platform">&nbsp;on {action.platform}</span>
          )}
        </div>
      );
  }
};

export const TransactionCard = memo(RenderTransactionCard);
