import { memo } from "react";
import { ActivityType, ActivityTypeMapping } from "../utils/activity";
import { formatText, resolveMediaURL, isSameAddress } from "../utils/utils";
import { ModalType } from "../hooks/useModal";
import { RenderToken } from "./FeedItem";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import _ from "lodash";

const RenderTransactionCard = (props) => {
  const { actions, openModal, network, owner } = props;
  const sortedActions = _.sortBy(
    actions,
    (x) => x.type !== ActivityType.multisig || x.metadata.action !== "execution"
  );

  return sortedActions.map((action) => {
    const metadata = action?.metadata;
    const actionId = action.action_id;
    const renderContent = (() => {
      switch (action.type) {
        case ActivityType.approval:
          return null;
        case ActivityType.liquidity:
          return (
            <div className="feed-content">
              {
                ActivityTypeMapping(action.type).action[
                  metadata.action || "default"
                ]
              }
              {metadata.tokens.map((x) =>
                RenderToken({
                  key: `${actionId}_${x.name || x.symbol}_${x.value}`,
                  name: x.name,
                  symbol: x.symbol,
                  image: x.image,
                  value: {
                    value: x.value,
                    decimals: x.decimals,
                  },
                })
              )}
              {ActivityTypeMapping(action.type).prep}
              {action.platform && (
                <>{" "}on {action.platform}</>
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
              {ActivityTypeMapping(action.type).prep}
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
                <>{" "}on {action.platform}</>
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
              {metadata.owner && (
                <RenderProfileBadge identity={metadata.owner} remoteFetch />
              )}
              {metadata.vault?.address && (
                <>
                  {" "} on
                  <RenderProfileBadge
                    identity={metadata.vault.address}
                    remoteFetch
                  />
                </>
              )}
              {action.platform && (
                <>{" "}on {action.platform}</>
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
              {metadata.address && (
                <RenderProfileBadge identity={metadata.address} remoteFetch />
              )}
              {action.platform && (
                <>{" "}on {action.platform}</>
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
                {metadata.token &&
                  RenderToken({
                    key: `${actionId}_${
                      metadata.token.name || metadata.token.symbol
                    }_${metadata.token.value}`,
                    name: metadata.token.name,
                    symbol: metadata.token.symbol,
                    image: metadata.token.image,
                    value: {
                      value: metadata.token.value,
                      decimals: metadata.token.decimals,
                    },
                  })}
                {action.platform && (
                  <>{" "}on {action.platform}</>
                )}
              </div>
            </>
          );
        default:
          const isOwner = isSameAddress(owner, action.to);

          return (
            <div className="feed-content">
              { isOwner ? (
                <>
                  {
                    ActivityTypeMapping(action.type).action["receive"]
                  }
                  {action.duplicatedObjects.map((x, idx) => {
                    return x.contract_address &&
                      (x.standard === 721 || x.standard === 1155) ? (
                      <span
                        key={`${idx}_preview`}
                        className="feed-token c-hand"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openModal(ModalType.nft, {
                            remoteFetch: true,
                            network: network,
                            standard: x.standard,
                            contractAddress: x.contract_address,
                            tokenId: x.id,
                          });
                        }}
                      >
                        {x.image_url && (
                          <NFTAssetPlayer
                            className="feed-token-icon"
                            src={resolveMediaURL(x.image_url)}
                            type={"image/png"}
                            width={20}
                            height={20}
                            alt={x.title || x.name}
                          />
                        )}
                        <span className="feed-token-value">
                          {x.title || x.name}
                        </span>
                        {x.id && !x.title && (
                          <small className="feed-token-meta">{`#${formatText(
                            x.id
                          )}`}</small>
                        )}
                      </span>
                    ) : (
                      RenderToken({
                        key: `${actionId + idx}_${x.name || x.symbol}_${x.value}`,
                        name: x.name,
                        symbol: x.symbol,
                        image: x.image,
                        value: {
                          value: x.value,
                          decimals: x.decimals,
                        },
                      })
                    );
                  })}
                </>
              ) : (
                <>
                  {
                    ActivityTypeMapping(action.type).action[
                      metadata.action || "default"
                    ]
                  }
                  {action.duplicatedObjects.map((x, idx) => {
                    return x.contract_address &&
                      (x.standard === 721 || x.standard === 1155) ? (
                      <span
                        key={`${idx}_preview`}
                        className="feed-token c-hand"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openModal(ModalType.nft, {
                            remoteFetch: true,
                            network: network,
                            standard: x.standard,
                            contractAddress: x.contract_address,
                            tokenId: x.id,
                          });
                        }}
                      >
                        {x.image_url && (
                          <NFTAssetPlayer
                            className="feed-token-icon"
                            src={resolveMediaURL(x.image_url)}
                            type={"image/png"}
                            width={20}
                            height={20}
                            alt={x.title || x.name}
                          />
                        )}
                        <span className="feed-token-value">
                          {x.title || x.name}
                        </span>
                        {x.id && !x.title && (
                          <small className="feed-token-meta">{`#${formatText(
                            x.id
                          )}`}</small>
                        )}
                      </span>
                    ) : (
                      RenderToken({
                        key: `${actionId + idx}_${x.name || x.symbol}_${x.value}`,
                        name: x.name,
                        symbol: x.symbol,
                        image: x.image,
                        value: {
                          value: x.value,
                          decimals: x.decimals,
                        },
                      })
                    );
                  })}
                  {action.to && ActivityTypeMapping(action.type).prep && (
                    <>
                      {ActivityTypeMapping(action.type).prep}
                      <RenderProfileBadge identity={action.to} remoteFetch />
                    </>
                  )}
                </>
              )}
              {action.platform && (
                <>{" "}on {action.platform}</>
              )}
            </div>
          );
      }
    })();
    return (
      <div className={`feed-item-body ${action.type}`} key={actionId}>
        {renderContent}
      </div>
    );
  });
};

export const TransactionCard = memo(RenderTransactionCard);
