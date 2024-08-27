import { memo, useMemo } from "react";
import {
  ActionStructMapping,
  ActivityTag,
  ActivityType,
} from "../utils/activity";
import {
  MediaType,
  NFTAssetPlayer,
  isImage,
  isVideo,
} from "../shared/NFTAssetPlayer";
import { ModalType } from "../hooks/useModal";
import { resolveMediaURL } from "../utils/utils";
import { domainRegexp } from "../feed/ActionExternalMenu";
import Link from "next/link";
import RenderProfileBadge from "./RenderProfileBadge";
import RenderObjects from "./RenderObjects";
import _ from "lodash";
import { formatDistanceToNow } from "date-fns";

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
        x.attachments.media.forEach((i) => {
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

    const mediaRender = useMemo(() => {
      if (!attachments?.media?.length) return null;

      return (
        <div className={`feed-content media-gallery`}>
          {attachments.media?.map((x, cIdx) => {
            const idIndex = `${network}.${x.address}.${x.id}`;
            const infoItem = nftInfos?.find(
              (info) => info.nft_id === idIndex.toLowerCase()
            );
            const nftImageUrl = infoItem?.previews?.image_medium_url;

            if (!isImage(x.mime_type) && !isVideo(x.mime_type) && !nftImageUrl)
              return null;

            return (
              <NFTAssetPlayer
                key={`${cIdx}_media_image`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openModal(x.mime_type ? ModalType.media : ModalType.nft, {
                    type: x.mime_type || "image/png",
                    url: resolveMediaURL(x.address),
                    asset: x.mime_type
                      ? undefined
                      : {
                          network,
                          standard: x.standard,
                          contractAddress: x.address,
                          tokenId: x.id,
                          asset: infoItem,
                        },
                  });
                }}
                className="feed-content-img"
                src={resolveMediaURL(x.standard ? nftImageUrl : x.address)}
                type={x.mime_type || "image/png"}
                width="auto"
                height="auto"
                placeholder
                alt="Feed Image"
              />
            );
          })}
        </div>
      );
    }, [attachments?.media]);

    const TargetsRender = useMemo(() => {
      if (!attachments?.targets?.length) return null;

      return attachments.targets.map((target, targetIdx) => (
        <Link
          key={`profile_target_${targetIdx}_${target.address}`}
          onClick={(e) => {
            if (target.article) {
              e.preventDefault();
              e.stopPropagation();
              openModal(ModalType.article, {
                title: target.article.title,
                content: target.article.body,
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
            <div className="feed-item-header">
              <div className="feed-target-name">
                <RenderProfileBadge
                  platform={feedPlatform}
                  identity={target.identity || target.name}
                  remoteFetch
                  fullProfile
                />
              </div>
              <div className="feed-timestamp">
                {formatDistanceToNow(new Date(target.timestamp * 1000), {
                  addSuffix: false,
                })}
              </div>
            </div>
          )}
          <div className="feed-target-content">
            {target.image && (
              <NFTAssetPlayer
                className="feed-content-img float-right"
                src={target.image}
                height={40}
                width={40}
                placeholder
                type="image/png"
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
                  <small className="text-gray-dark">({target.subTitle})</small>
                )}
              </div>
            )}
          </div>
          {target.address && (
            <div className="feed-target-address">{target.address}</div>
          )}
          {target.media?.length > 0 && (
            <div className={`feed-target-content media-gallery`}>
              {target.media.map((x) => {
                return isImage(x.mime_type) || isVideo(x.mime_type) ? (
                  <NFTAssetPlayer
                    key={x.address}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      openModal(ModalType.media, {
                        type: x.mime_type || "image/png",
                        url: resolveMediaURL(x.address),
                      });
                    }}
                    className="feed-content-img"
                    src={resolveMediaURL(x.address)}
                    type={x.mime_type}
                    width="auto"
                    height="auto"
                    placeholder
                    alt="Feed Image"
                  />
                ) : x.mime_type.includes(MediaType.HTML) ? (
                  <Link
                    href={x.address}
                    target={"_blank"}
                    className="feed-token feed-token-lg"
                  >
                    {x.address}
                  </Link>
                ) : target.content ? (
                  ""
                ) : (
                  x.address
                );
              })}
            </div>
          )}
        </Link>
      ));
    }, [attachments?.targets]);

    const ObjectsRender = useMemo(
      () =>
        objects?.filter(Boolean).map((i, idx) => {
          const idIndex = `${network}.${i.address}.${i.id}`;
          const infoItem = nftInfos?.find(
            (x) => x.nft_id === idIndex.toLowerCase()
          );

          return (
            <RenderObjects
              key={`object_${idx}`}
              nftInfo={infoItem}
              openModal={openModal}
              data={i}
              network={network}
            />
          );
        }),
      [objects]
    );

    const ProfilesRender = useMemo(
      () =>
        attachments?.profiles?.length > 0 && (
          <div className="feed-profiles-list">
            {attachments.profiles.map((x, idx) => (
              <div
                key={`profile_${x.key}_${idx}`}
                className="profile-list-item"
              >
                <div className="list-item-left">{x.key}</div>
                <div className="list-item-right">{x.value}</div>
              </div>
            ))}
          </div>
        ),
      [attachments?.profiles]
    );

    return (
      <>
        <div
          className={`feed-content${checkEmojis ? " text-emoji" : ""}`}
          key={`content_${id}_${idx}`}
        >
          {verb}
          {ObjectsRender}
          {prep}
          {target && (
            <RenderProfileBadge
              key={`target_${id}_${idx}`}
              identity={target}
              remoteFetch
            />
          )}
          {platform && <> on {overridePlatform || platform}</>}
        </div>
        {attachments && (
          <>
            {mediaRender}
            <div key={`attachments_${id}_${idx}`} className="feed-content">
              {TargetsRender}
              {ProfilesRender}
            </div>
          </>
        )}
      </>
    );
  };
  return (
    <div className="feed-item-body">
      {renderData
        .filter((x) => x.verb)
        .map((x, idx) => {
          const checkEmojis =
            /^(\p{Emoji}\uFE0F|\p{Emoji_Presentation})+$/gu.test(x.verb);
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
