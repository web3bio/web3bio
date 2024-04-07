import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType } from "../../utils/activity";
import { isValidEthereumAddress } from "../../utils/regexp";
import {
  ActivityTypeMapping,
  formatText,
  resolveMediaURL,
} from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { RenderToken } from "./FeedItem";

const RenderCollectibleCard = (props) => {
  const { actions, openModal, network } = props;
  return actions.map((action) => {
    const metadata = action?.metadata;
    const collections = action?.duplicatedObjects;
    const actionId = action?.action_id;
    const renderContent = (() => {
      switch (action.type) {
        case ActivityType.approval:
          return null;
        case ActivityType.trade:
        case ActivityType.mint:
          return (
            <>
              <div className="feed-content">
                {
                  ActivityTypeMapping(action.type).action[
                    metadata.action || "default"
                  ]
                }
                &nbsp;
                {collections.map((x, cIdx) => {
                  return (
                    <span
                      key={`${cIdx}_preview`}
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
                      <span className="feed-token-value">
                        {x.title || x.name}
                      </span>
                      {x.id && !x.title && (
                        <small className="feed-token-meta">{`#${formatText(
                          x.id
                        )}`}</small>
                      )}
                    </span>
                  );
                })}
                {action.platform && (
                  <span className="feed-platform">
                    &nbsp;on {action.platform}
                  </span>
                )}
              </div>
              {collections.some((x) => x.image_url) &&
                action.type === ActivityType.mint && (
                  <div className="feed-content media-gallery">
                    {collections.map((x, cIdx) => {
                      return (
                        x.image_url && (
                          <NFTAssetPlayer
                            key={`${cIdx}_image`}
                            onClick={(e) => {
                              openModal(ModalType.nft, {
                                remoteFetch: true,
                                network: network,
                                standard: x.standard,
                                contractAddress: x.contract_address,
                                tokenId: x.id,
                              });
                            }}
                            className="feed-content-img"
                            src={resolveMediaURL(x.image_url)}
                            type={"image/png"}
                            width="auto"
                            height="100%"
                            placeholder={true}
                            alt={x.title}
                          />
                        )
                      );
                    })}
                  </div>
                )}
            </>
          );
        case ActivityType.transfer:
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
                  x.contract_address && (x.standard === 721 || x.standard === 1155) ? 
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
        default:
          return (
            <div className="feed-content">
              {
                ActivityTypeMapping(action.type).action[
                  metadata.action || "default"
                ]
              }
              &nbsp;
              {action.tag === "collectible" ? (
                <span className="feed-token">
                  {metadata.image_url && (
                    <NFTAssetPlayer
                      className="feed-token-icon"
                      src={resolveMediaURL(metadata.image_url)}
                      type={"image/png"}
                      width={20}
                      height={20}
                      alt={metadata.title || metadata.name}
                    />
                  )}
                  {metadata.title || metadata.name}
                  {metadata.id && !metadata.title && (
                    <small className="feed-token-meta">{`#${formatText(
                      metadata.id
                    )}`}</small>
                  )}
                </span>
              ) : (
                RenderToken({
                  key: `${action.type}_${metadata.symbol}_${metadata.value}_${action.to}}`,
                  name: metadata.name,
                  symbol: metadata.symbol,
                  image: metadata.image,
                  value: {
                    value: metadata.value,
                    decimals: metadata.decimals,
                  },
                })
              )}
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
      <div key={actionId} className="feed-item-body">
        {renderContent}
      </div>
    );
  });
};

export const CollectibleCard = memo(RenderCollectibleCard);
