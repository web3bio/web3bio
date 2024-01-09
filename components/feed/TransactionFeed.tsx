import { memo } from "react";
import { ActivityType } from "../../utils/activity";
import { ActivityTypeMapping, isSameAddress } from "../../utils/utils";
import { RenderToken } from "./FeedItem";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import _ from "lodash";

export const getDuplicatedTransfer = (actions) => {
  const _data = JSON.parse(JSON.stringify(actions));
  const duplicatedObjects = new Array();
  _data.forEach((x, idx) => {
    const dupIndex = duplicatedObjects.findIndex(
      (i) =>
        i.tag === x.tag &&
        i.type === x.type &&
        i.from === x.from &&
        i.to === x.to
    );
    if (dupIndex === -1) {
      duplicatedObjects.push({
        ...x,
        duplicatedObjects: [x.metadata],
      });
    } else {
      duplicatedObjects[dupIndex].duplicatedObjects.push(x.metadata);
    }
  });

  return duplicatedObjects;
};

const RenderTransactionCard = (props) => {
  const { actions, owner } = props;
  const resolvedActions = getDuplicatedTransfer(actions);

  return (
    <>
      {resolvedActions
        ?.filter(
          (x) => isSameAddress(x.from, owner) || isSameAddress(x.to, owner)
        )
        .map((action) => {
          const metadata = action?.metadata;
          const id = action?.id;

          switch (action.type) {
            case ActivityType.liquidity:
              return (
                <div key={id} className="feed-content">
                  {
                    ActivityTypeMapping(action.type).action[
                      metadata.action || "default"
                    ]
                  }
                  &nbsp;
                  {metadata.tokens.map((x) =>
                    RenderToken({
                      key: `${id}_${x.name}_${
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
                <div key={id} className="feed-content">
                  {
                    ActivityTypeMapping(action.type).action[
                      metadata.action || "default"
                    ]
                  }
                  &nbsp;
                  {RenderToken({
                    key: `${id}_from_${metadata.from?.name}`,
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
                    key: `${id}_to_${metadata.to?.name}`,
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
                <div key={id} className="feed-content">
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
                <div key={id} className="feed-content">
                  {
                    ActivityTypeMapping(action.type).action[
                      metadata.action || "default"
                    ]
                  }
                  &nbsp;
                  {metadata.address && (
                    <RenderProfileBadge
                      identity={metadata.address}
                      remoteFetch
                    />
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
                  <div key={id} className="feed-content">
                    {
                      ActivityTypeMapping(action.type).action[
                        metadata.action || "default"
                      ]
                    }
                    &nbsp;
                    {metadata.token &&
                      RenderToken({
                        key: `${id}_${metadata.token.name}_${
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
                <div key={id} className="feed-content">
                  {
                    ActivityTypeMapping(action.type).action[
                      metadata.action || "default"
                    ]
                  }
                  &nbsp;
                  <div className="duplicated-items">
                    {action.duplicatedObjects.map((x) => {
                      return RenderToken({
                        key: `${x.id}_${ActivityType.transfer}_${x.name}_${x.value}`,
                        name: x.name,
                        symbol: x.standard === 721 ? x.title : x.symbol,
                        image: x.image || x.image_url,
                        value: {
                          value: x.value,
                          decimals: x.decimals,
                        },
                      });
                    })}
                  </div>
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
        })}
    </>
  );
};

export const TransactionCard = memo(RenderTransactionCard);
