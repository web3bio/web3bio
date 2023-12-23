import { memo } from "react";
import { ActivityType } from "../../utils/activity";
import { ActivityTypeMapping } from "../../utils/utils";
import { RenderToken } from "./FeedItem";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import _ from "lodash";

const RenderTransactionCard = (props) => {
  const { action, id } = props;
  const metadata = action?.metadata;

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
            {metadata.owner && (
              <RenderProfileBadge identity={metadata.owner} remoteFetch />
            )}
            {metadata.vault?.address && (
            <>
              on 
              <RenderProfileBadge identity={metadata.vault.address} remoteFetch />
            </>
            )}
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
            {metadata.address && (
              <RenderProfileBadge identity={metadata.address} remoteFetch />
            )}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
    default:
      return (
        <div className="feed-content">
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
              <RenderProfileBadge
                identity={action.to}
                remoteFetch
              />
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
