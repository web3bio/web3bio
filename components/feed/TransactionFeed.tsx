import { memo } from "react";
import { ActivityType } from "../../utils/activity";
import { ActivityTypeMapping } from "../../utils/utils";
import { RenderToken } from "./FeedItem";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import _ from "lodash";

const RenderTransactionCard = (props) => {
  const { actions } = props;
  return actions.map((action) => {
    const metadata = action?.metadata;
    const actionId = action.action_id;
    const renderContent = (() => {
      switch (action.type) {
        case ActivityType.approval:
          return <></>;
        case ActivityType.liquidity:
          return (
            <div className="feed-content">
              {
                ActivityTypeMapping(action.type).action[
                  metadata.action || "default"
                ]
              }
              &nbsp;
              {metadata.tokens.map((x) =>
                RenderToken({
                  key: `${actionId}_${x.name}_${
                    ActivityTypeMapping(action.type).prep
                  }`,
                  name: x.name,
                  symbol: x.symbol,
                  image: x.image,
                  value: {
                    value: x.value,
                    decimals: x.decimals,
                  },
                })
              )}{" "}
              {ActivityTypeMapping(action.type).prep}
              {action.platform && (
                <span className="feed-platform">
                  &nbsp;on {action.platform}
                </span>
              )}
            </div>
          );
        case ActivityType.swap:
          return (
            <div className="feed-content">
              {
                ActivityTypeMapping(action.type).action[
                  metadata.action || "default"
                ]
              }
              &nbsp;
              {RenderToken({
                key: `${actionId}_from_${metadata.from?.name}`,
                name: metadata.from,
                symbol: metadata.from.symbol,
                image: metadata.from.image,
                value: {
                  value: metadata.from.value,
                  decimals: metadata.from.decimals,
                },
              })}
              &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
              {RenderToken({
                key: `${actionId}_to_${metadata.to?.name}`,
                name: metadata.to.name,
                symbol: metadata.to.symbol,
                image: metadata.to.image,
                value: {
                  value: metadata.to.value,
                  decimals: metadata.to.decimals,
                },
              })}
              {action.platform && (
                <span className="feed-platform">
                  &nbsp;on {action.platform}
                </span>
              )}
            </div>
          );
        case ActivityType.multisig:
          return (
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
                  <RenderProfileBadge
                    identity={metadata.vault.address}
                    remoteFetch
                  />
                </>
              )}
              {action.platform && (
                <span className="feed-platform">
                  &nbsp;on {action.platform}
                </span>
              )}
            </div>
          );
        case ActivityType.deploy:
          return (
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
                <span className="feed-platform">
                  &nbsp;on {action.platform}
                </span>
              )}
            </div>
          );
        case ActivityType.bridge:
          return (
            <>
              <div className="feed-content">
                {
                  ActivityTypeMapping(action.type).action[
                    metadata.action || "default"
                  ]
                }
                &nbsp;
                {metadata.token &&
                  RenderToken({
                    key: `${actionId}_${metadata.token.name}_${
                      ActivityTypeMapping(action.type).prep
                    }`,
                    name: metadata.token.name,
                    symbol: metadata.token.symbol,
                    image: metadata.token.image,
                    value: {
                      value: metadata.token.value,
                      decimals: metadata.token.decimals,
                    },
                  })}
                {action.platform && (
                  <span className="feed-platform">
                    &nbsp;on {action.platform}
                  </span>
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
              {action.duplicatedObjects.map((x, idx) => {
                return RenderToken({
                  key: `${actionId + idx}_${ActivityType.transfer}_${x.name}_${
                    x.value
                  }`,
                  name: x.name,
                  symbol: x.standard === 721 ? x.title : x.symbol,
                  image: x.image || x.image_url,
                  value: {
                    value: x.value,
                    decimals: x.decimals,
                  },
                });
              })}
              {action.to && ActivityTypeMapping(action.type).prep && (
                <>
                  &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
                  <RenderProfileBadge identity={action.to} remoteFetch />
                </>
              )}
              {action.platform && (
                <span className="feed-platform">
                  &nbsp;on {action.platform}
                </span>
              )}
            </div>
          );
      }
    })();
    return (
      <div className="feed-item-body" key={actionId}>
        {renderContent}
      </div>
    );
  });
};

export const TransactionCard = memo(RenderTransactionCard);
