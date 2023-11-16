import Link from "next/link";
import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType } from "../../utils/activity";
import {
  ActivityTypeMapping,
  formatText,
  resolveMediaURL,
} from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderCollectibleCard = (props) => {
  const { action, remoteFetch, openModal, network } = props;
  const metadata = action?.metadata;

  switch (action.type) {
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
            <span className="feed-token">
              {metadata.image_url && (
                <NFTAssetPlayer
                  className="feed-token-icon"
                  src={resolveMediaURL(metadata.image_url)}
                  type={"image/png"}
                  width={20}
                  height={20}
                  alt={metadata.title}
                />
              )}
              {metadata.title || metadata.name}
              {metadata.id && (
                <small className="feed-token-meta">{`#${formatText(
                  metadata.id
                )}`}</small>
              )}
            </span>
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
          {metadata.title && (
            <div className="feed-content">
              <Link
                className="feed-target"
                href={action.related_urls[0]}
                target="_blank"
              >
                <div className="feed-target-name">
                  <strong>{metadata.title}</strong>
                </div>
                <div className="feed-target-content">{metadata.name}</div>
                {metadata.image_url && (
                  <div className={`feed-target-content media-gallery`}>
                    <NFTAssetPlayer
                      className="feed-content-img"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(ModalType.nft, {
                          remoteFetch: true,
                          network: network,
                          standard: metadata.standard,
                          contractAddress: metadata.contract_address,
                          tokenId: metadata.id,
                        });
                      }}
                      src={resolveMediaURL(metadata.image_url)}
                      type={"image/png"}
                      width="auto"
                      height="100%"
                      placeholder={true}
                      alt={metadata.title}
                    />
                  </div>
                )}
              </Link>
            </div>
          )}
        </>
      );
    default:
      return (
        <>
          <div className="feed-content">
            {
              ActivityTypeMapping(action.type).action[
                metadata.action || "default"
              ]
            }
            &nbsp;
            <span className="feed-token">
              {metadata.title || metadata.name}
              {metadata.id && (
                <small className="feed-token-meta">{`#${formatText(
                  metadata.id
                )}`}</small>
              )}
            </span>
            {action.to && ActivityTypeMapping(action.type).prep && (
              <>
                &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
                <RenderProfileBadge
                  remoteFetch={remoteFetch}
                  identity={action.to}
                />
              </>
            )}
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
        </>
      );
  }
};

export const CollectibleCard = memo(RenderCollectibleCard);
