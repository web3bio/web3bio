import Link from "next/link";
import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType } from "../../utils/activity";
import {
  ActivityTypeMapping,
  formatText,
  isSameAddress,
  resolveMediaURL,
} from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

export const getDuplicatedRenew = (actions) => {
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
const RenderCollectibleCard = (props) => {
  const { actions, openModal, network, owner } = props;
  const resolvedActions = getDuplicatedRenew(actions);
  return (
    <>
      {resolvedActions
        ?.filter(
          (x) => isSameAddress(x.from, owner) || isSameAddress(x.to, owner)
        )
        .map((action, idx) => {
          const metadata = action?.metadata;
          const collections = action?.duplicatedObjects;
          switch (action.type) {
            case ActivityType.approval:
              return <></>;
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
                    {action.platform && (
                      <span className="feed-platform">
                        &nbsp;on {action.platform}
                      </span>
                    )}
                  </div>
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

export const CollectibleCard = memo(RenderCollectibleCard);
