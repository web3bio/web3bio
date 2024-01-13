import { memo } from "react";
import { ActivityType } from "../../utils/activity";
import { ActivityTypeMapping, formatText, resolveMediaURL } from "../../utils/utils";
import { ModalType } from "../../hooks/useModal";
import { RenderToken } from "./FeedItem";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import _ from "lodash";

const RenderTransactionCard = (props) => {
  const { actions, openModal, network } = props;
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
                return (
                  x.contract_address && x.standard ? 
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
                          alt={x.title}
                        />
                      )}
                      {x.title || x.name}
                      {x.id && !x.title && (
                        <small className="feed-token-meta">{`#${formatText(
                          x.id
                        )}`}</small>
                      )}
                    </span>
                  : RenderToken({
                    key: `${actionId + idx}_${ActivityType.transfer}_${x.name}_${
                      x.value
                    }`,
                    name: x.name,
                    symbol: x.symbol,
                    image: x.image,
                    value: {
                      value: x.value,
                      decimals: x.decimals,
                    },
                  })
                )
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
      <div className={`feed-item-body ${action.type}`} key={actionId}>
        {renderContent}
      </div>
    );
  });
};

export const TransactionCard = memo(RenderTransactionCard);
