import Link from "next/link";
import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType, ActivityTypeMapping } from "../../utils/activity";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { resolveMediaURL } from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { domainRegexp } from "./ActionExternalMenu";

const RenderSocialCard = (props) => {
  const { actions, openModal, platform } = props;
  return actions.map((action) => {
    const metadata = action?.metadata;
    const checkEmojis = /^(\p{Emoji}\uFE0F|\p{Emoji_Presentation})+$/gu.test(
      metadata?.body
    );
    const actionId = action?.action_id;
    const renderContent = (() => {
      switch (action.type) {
        case ActivityType.profile:
          return (
            <>
              <div className="feed-content">
                {
                  ActivityTypeMapping(action.type).action[
                    metadata.key && !metadata?.value
                      ? "delete"
                      : metadata.action || "default"
                  ]
                }
                &nbsp;
                {(action.duplicatedObjects?.length &&
                  metadata.action === "renew" &&
                  action.duplicatedObjects.map((x) => (
                    <RenderProfileBadge
                      key={`${actionId}_${action.type}_${x.handle}_${x.profile_id}`}
                      identity={x.handle}
                      platform={platform}
                      remoteFetch
                      fullProfile
                    />
                  ))) || (
                  <RenderProfileBadge
                    platform={platform}
                    identity={metadata.handle}
                    remoteFetch
                    fullProfile
                  />
                )}
                {platform && (
                  <span className="feed-platform">&nbsp;on {platform}</span>
                )}
              </div>
              {action.duplicatedObjects?.map((x) => {
                return (
                  x.key && (
                    <div
                      key={`${actionId}_${x.key}_${x.handle}`}
                      className="feed-content"
                    >
                      <Link
                        className="feed-target"
                        href={
                          action.related_urls?.[0] ||
                          `https://web3.bio/${x.handle}`
                        }
                        target="_blank"
                      >
                        <div className="feed-target-name">{x.key}</div>
                        <div className="feed-target-content">{x.value}</div>
                        {x.handle && (
                          <div className="feed-target-address">{x.handle}</div>
                        )}
                      </Link>
                    </div>
                  )
                );
              })}
            </>
          );
        case ActivityType.post:
        case ActivityType.comment:
        case ActivityType.share:
        case ActivityType.revise:
          if (["Mirror"].includes(platform) || metadata.summary) {
            return (
              <>
                <div className="feed-content">
                  {
                    ActivityTypeMapping(action.type).action[
                      metadata.action || "default"
                    ]
                  }
                  {platform && (
                    <span className="feed-platform">&nbsp;on {platform}</span>
                  )}
                </div>
                {metadata.body && (
                  <div className="feed-content">
                    <div
                      className="feed-target c-hand"
                      onClick={(e) => {
                        if (metadata.body) {
                          e.preventDefault();
                          e.stopPropagation();
                          openModal(ModalType.article, {
                            title: metadata.title,
                            content: metadata.body,
                            baseURL: `https://${
                              domainRegexp.exec(
                                action.content_uri || action.related_urls[0]
                              )?.[1]
                            }`,
                            link: action.content_uri,
                          });
                        }
                      }}
                    >
                      <div className="feed-target-name">{metadata.title}</div>
                      <div className="feed-target-description">
                        {metadata.body}
                      </div>
                    </div>
                  </div>
                )}
                {metadata.target && (
                  <div className="feed-content">
                    <Link
                      className="feed-target"
                      href={resolveIPFS_URL(metadata.target_url) || ""}
                      target="_blank"
                    >
                      <div className="feed-target-name">
                        <RenderProfileBadge
                          platform={platform}
                          identity={metadata.target?.handle}
                          remoteFetch
                          fullProfile
                        />
                      </div>
                      <div className="feed-target-content">
                        {metadata.target?.body}
                      </div>
                      {metadata.target?.media?.length > 0 && (
                        <div className={`feed-target-content media-gallery`}>
                          {metadata.target?.media?.map((x) =>
                            x.mime_type.includes("image", "video", "audio") ? (
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
                                height="100%"
                                placeholder={true}
                                alt={metadata.target?.body}
                              />
                            ) : null
                          )}
                        </div>
                      )}
                    </Link>
                  </div>
                )}
              </>
            );
          } else {
            return (
              <>
                {metadata?.body ? (
                  <div
                    className={`feed-content text-large${
                      checkEmojis ? " text-emoji" : ""
                    }`}
                  >
                    {metadata?.body}
                  </div>
                ) : (
                  <div className="feed-content">
                    {
                      ActivityTypeMapping(action.type).action[
                        metadata.action || "default"
                      ]
                    }
                    {platform && (
                      <span className="feed-platform">&nbsp;on {platform}</span>
                    )}
                  </div>
                )}
                {metadata?.media?.length > 0 && (
                  <div
                    className={`feed-content${
                      metadata.media.length > 1 ? " media-gallery" : ""
                    }`}
                  >
                    {metadata.media?.map((x) =>
                      x.mime_type.includes("image", "video", "audio") ? (
                        <NFTAssetPlayer
                          key={x.address}
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
                          width="auto"
                          height="auto"
                          placeholder={true}
                          alt={"Feed Image"}
                        />
                      ) : null
                    )}
                  </div>
                )}
                {metadata.target && (
                  <div className="feed-content">
                    <Link
                      className="feed-target"
                      href={resolveIPFS_URL(metadata.target_url) || ""}
                      target="_blank"
                    >
                      <div className="feed-target-name">
                        <RenderProfileBadge
                          platform={platform}
                          identity={metadata.target?.handle}
                          remoteFetch
                          fullProfile
                        />
                      </div>
                      <div className="feed-target-content">
                        {metadata.target?.body}
                      </div>
                      {metadata.target?.media?.length > 0 && (
                        <div
                          className={`feed-target-content${
                            metadata.target?.media?.length > 1
                              ? " media-gallery"
                              : ""
                          }`}
                        >
                          {metadata.target?.media?.map((x) =>
                            x.mime_type.includes("image", "video", "audio") ? (
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
                            ) : null
                          )}
                        </div>
                      )}
                    </Link>
                  </div>
                )}
              </>
            );
          }
        case ActivityType.mint:
          return (
            <>
              <div className="feed-content">
                {ActivityTypeMapping(action.type).action["post"]}
                {platform && (
                  <span className="feed-platform">&nbsp;on {platform}</span>
                )}
              </div>
              <div className="feed-content">
                <Link
                  className="feed-target"
                  href={action.related_urls[0]}
                  target="_blank"
                >
                  <div className="feed-target-name">{metadata.handle}</div>
                  <div className="feed-target-content">{metadata.body}</div>
                  {metadata.media?.length > 0 && (
                    <div
                      className={`feed-target-content${
                        metadata.media?.length > 1 ? " media-gallery" : ""
                      }`}
                    >
                      {metadata.media?.map((x) =>
                        x.mime_type.includes("image") ? (
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
                            height="100%"
                            placeholder={true}
                            alt={"Feed Image"}
                          />
                        ) : (
                          ""
                        )
                      )}
                    </div>
                  )}
                </Link>
              </div>
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
                {platform && (
                  <span className="feed-platform">&nbsp;on {platform}</span>
                )}
              </div>
              {metadata.body && (
                <div className="feed-content">
                  <Link
                    className="feed-target"
                    href={action.related_urls[0]}
                    target="_blank"
                  >
                    <div className="feed-target-name">{metadata.title}</div>
                    <div className="feed-target-description">
                      {metadata.body}
                    </div>
                  </Link>
                </div>
              )}
              {metadata.target && (
                <div className="feed-content">
                  <Link
                    className="feed-target"
                    href={resolveIPFS_URL(metadata.target_url) || ""}
                    target="_blank"
                  >
                    <div className="feed-target-name">
                      <RenderProfileBadge
                        platform={platform}
                        identity={metadata.target?.handle}
                        remoteFetch
                        fullProfile
                      />
                    </div>
                    <div className="feed-target-content">
                      {metadata.target?.body}
                    </div>
                    {metadata.target?.media?.length > 0 && (
                      <div className={`feed-target-content media-gallery`}>
                        {metadata.target?.media?.map((x) =>
                          x.mime_type.includes("image") ? (
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
                              height="100%"
                              placeholder={true}
                              alt={metadata.target?.body}
                            />
                          ) : (
                            ""
                          )
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              )}
            </>
          );
      }
    })();
    return (
      <div key={actionId} className="item-body">
        {renderContent}
      </div>
    );
  });
};

export const SocialCard = memo(RenderSocialCard);
