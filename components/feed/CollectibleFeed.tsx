import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType } from "../../utils/activity";
import { isValidEthereumAddress } from "../../utils/regexp";
import {
  ActivityTypeMapping,
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { RenderToken } from "./FeedItem";

const RenderCollectibleCard = (props) => {
  const { actions, openModal, network, owner } = props;
  return actions.map((action) => {
    if (!isSameAddress(action.from, owner) && !isSameAddress(action.to, owner))
      return null;
    const metadata = action?.metadata;
    const collections = action?.duplicatedObjects;
    const actionId = action?.action_id;
    const renderContent = (() => {
      switch (action.type) {
        case ActivityType.approval:
          return <></>;
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
                      {x.title || x.name}
                      {x.id && (
                        <small className="feed-token-meta">{`#${formatText(
                          x.id
                        )}`}</small>
                      )}
                    </span>
                  );
                })}
                {action.from &&
                  action.type == ActivityType.trade &&
                  isValidEthereumAddress(action.from) && (
                    <span>
                      &nbsp; from{" "}
                      <RenderProfileBadge identity={action.from} remoteFetch />
                    </span>
                  )}
                {action.platform && (
                  <span className="feed-platform">
                    &nbsp;on {action.platform}
                  </span>
                )}
              </div>
              {collections.some((x) => x.image_url) &&
                action.type === ActivityType.mint && (
                  <div className="feed-content">
                    <div className="feed-target collection-gallery">
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
                  </div>
                )}
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
              {action.tag === "collectible" ? (
                <span className="feed-token">
                  {metadata.title || metadata.name}
                  {metadata.id && (
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
