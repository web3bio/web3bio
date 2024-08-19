import { memo, useMemo } from "react";
import {
  ActionStructMapping,
  ActivityTag,
  ActivityType,
} from "../utils/activity";
import { NFTAssetPlayer, isImage, isVideo } from "../shared/NFTAssetPlayer";
import { ModalType } from "../hooks/useModal";
import { resolveMediaURL } from "../utils/utils";
import { domainRegexp } from "../feed/ActionExternalMenu";
import Link from "next/link";
import RenderProfileBadge from "./RenderProfileBadge";
import RenderObjects from "./RenderObjects";
import _ from "lodash";

function RenderFeedActionCard(props) {
  const {
    actions,
    id,
    owner,
    overridePlatform,
    openModal,
    network,
    tag,
    nftInfos,
    platform: feedPlatform,
  } = props;
  const renderData = useMemo(() => {
    const res = actions.map((x) => ({ ...ActionStructMapping(x, owner) }));
    if (tag !== ActivityTag.collectible) return res;

    const uniqAttachments = new Set();
    res.forEach((x) => {
      if (x.type === ActivityType.transfer) {
        x.attachments.medias.forEach((i) => {
          const uniqId = `${i.address}-${i.id}`;
          if (!uniqAttachments.has(uniqId)) {
            uniqAttachments.add(uniqId);
          }
        });
      }
    });
    return res.map((x, idx) => {
      return x.verb === "Transferred"
        ? {
            ...x,
            attachments:
              idx === res.length - 1
                ? {
                    medias: _.uniqBy(
                      x.attachments.medias,
                      (i) => `${i.address}-${i.id}`
                    ),
                  }
                : {
                    medias: [],
                  },
          }
        : x;
    });
  }, [actions, owner, tag]);

  const ActionContent = (props) => {
    const {
      verb,
      objects,
      prep,
      target,
      platform,
      idx,
      checkEmojis,
      attachments,
    } = props;

    const MediasRender = useMemo(() => {
      if (attachments?.medias?.filter((x) => x)?.length > 0) {
        return (
          <div
            className={`feed-content${
              attachments.medias.filter((x) => x?.mime_type).length == 1
                ? ""
                : " media-gallery"
            }`}
          >
            {attachments.medias?.map((x, cIdx) => {
              let infoItem = null as any;
              if (nftInfos?.length > 0) {
                const idIndex = `${network}.${x.address}.${x.id}`;
                infoItem = nftInfos.find(
                  (x) => x.nft_id === idIndex.toLowerCase()
                );
              }
              const nftImageUrl = infoItem?.previews?.image_medium_url;
              // if(x.address && rendered.includes(x.address)) return null
              // rendered.push(x.address)
              return isImage(x.mime_type) ||
                isVideo(x.mime_type) ||
                nftImageUrl ? (
                <NFTAssetPlayer
                  key={`${cIdx}_media_image`}
                  onClick={(e) => {
                    x.mime_type
                      ? openModal(ModalType.media, {
                          type: x.mime_type || "image/png",
                          url: resolveMediaURL(x.address),
                        })
                      : openModal(ModalType.nft, {
                          asset: {
                            network,
                            standard: x.standard,
                            contractAddress: x.address,
                            tokenId: x.id,
                            asset: {
                              ...infoItem,
                            },
                          },
                        });
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="feed-content-img"
                  src={resolveMediaURL(x.standard ? nftImageUrl : x.address)}
                  type={x.mime_type || "image/png"}
                  width="auto"
                  height="auto"
                  placeholder={true}
                  alt={"Feed Image"}
                />
              ) : null;
            })}
          </div>
        );
      }
    }, [attachments?.medias]);
    const TargetsRender = useMemo(() => {
      if (attachments?.targets?.filter((x) => x)?.length > 0) {
        return attachments.targets.map((target, targetIdx) => (
          <Link
            key={`profile_target_${targetIdx}_${target.address}`}
            onClick={(e) => {
              if (target.article) {
                e.preventDefault();
                e.stopPropagation();
                const article = target.article;
                openModal(ModalType.article, {
                  title: article.title,
                  content: article.body,
                  baseURL: `https://${
                    domainRegexp.exec(
                      actions[idx].content_uri || actions[idx].related_urls[0]
                    )?.[1]
                  }`,
                  link: actions[idx].content_uri,
                });
              }
            }}
            className="feed-target"
            href={target.url || ""}
            target="_blank"
          >
            {(target.identity || target.name) && (
              <div className="feed-target-name">
                <RenderProfileBadge
                  platform={feedPlatform}
                  identity={target.identity || target.name}
                  remoteFetch
                  fullProfile
                />
              </div>
            )}
            <div className="feed-target-content">
              {target.image && (
                <NFTAssetPlayer
                  className="feed-content-img float-right"
                  src={target.image}
                  height={40}
                  width={40}
                  placeholder={true}
                  type={"image/png"}
                  alt={target.title}
                />
              )}
              {target.content && (
                <div className="feed-target-description">{target.content}</div>
              )}
              {target.description && (
                <div className="feed-target-description">
                  {target.description}
                  {target.subTitle && (
                    <small className="text-gray-dark">
                      ({target.subTitle})
                    </small>
                  )}
                </div>
              )}
            </div>
            {target.address && (
              <div className="feed-target-address">{target.address}</div>
            )}
            {target?.media?.length > 0 && (
              <div
                className={`feed-target-content${
                  target?.media?.length > 1 ? " media-gallery" : ""
                }`}
              >
                {target.media.map((x) =>
                  isImage(x.mime_type) || isVideo(x.mime_type) ? (
                    <NFTAssetPlayer
                      onClick={(e) => {
                        openModal(ModalType.media, {
                          type: x.mime_type || "image/png",
                          url: resolveMediaURL(x.address),
                        });
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      className="feed-content-img"
                      src={resolveMediaURL(x.address)}
                      type={x.mime_type}
                      key={x.address}
                      width="auto"
                      height="auto"
                      placeholder={true}
                      alt={"Feed Image"}
                    />
                  ) : target?.content ? (
                    ""
                  ) : (
                    x.address
                  )
                )}
              </div>
            )}
          </Link>
        ));
      }
    }, [attachments?.targets]);
    const ObjectsRender = useMemo(() => {
      return objects
        ?.filter((i) => !!i)
        .map((i, idx) => {
          let infoItem = null;
          if (nftInfos?.length > 0) {
            const idIndex = `${network}.${i.address}.${i.id}`;
            infoItem = nftInfos.find((x) => x.nft_id === idIndex.toLowerCase());
          }
          return (
            <RenderObjects
              nftInfo={infoItem}
              key={`object_${idx}`}
              openModal={openModal}
              data={i}
              network={network}
            />
          );
        });
    }, [objects]);
    const ProfilesRender = useMemo(() => {
      if (attachments?.profiles?.length > 0) {
        return (
          <div className="feed-profiles-list">
            {attachments.profiles?.map((x, idx) => (
              <div
                key={`profile_${x.key}_${idx}`}
                className="profile-list-item"
              >
                <div className="list-item-left">{x.key}</div>
                <div className="list-item-right">{x.value}</div>
              </div>
            ))}
          </div>
        );
      }
    }, [attachments?.profiles]);
    return (
      <>
        <div
          className={`feed-content${checkEmojis ? " text-emoji" : ""}`}
          key={"content_" + id + idx}
        >
          {verb}
          {ObjectsRender}
          {prep}
          {target && (
            <RenderProfileBadge
              key={"target_" + id + idx}
              identity={target}
              remoteFetch
            />
          )}
          {platform && <> on {overridePlatform || platform}</>}
        </div>
        {attachments && (
          <div key={`attachments_${id}_${idx}`} className="feed-content">
            {MediasRender}
            {TargetsRender}
            {ProfilesRender}
          </div>
        )}
      </>
    );
  };
  return (
    <div className="feed-item-body">
      {renderData
        .filter((x) => x.verb)
        .map((x, idx) => {
          const { verb } = x;
          const checkEmojis =
            /^(\p{Emoji}\uFE0F|\p{Emoji_Presentation})+$/gu.test(verb);
          return (
            <ActionContent
              key={`action_content_${idx}`}
              checkEmojis={checkEmojis}
              {...x}
              idx={idx}
            />
          );
        })}
    </div>
  );
}

export default memo(RenderFeedActionCard);
