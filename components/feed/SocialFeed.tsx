import Link from "next/link";
import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType } from "../../utils/activity";
import { resolveIPFS_URL } from "../../utils/ipfs";
import {
  ActivityTypeMapping,
  isSameAddress,
  resolveMediaURL,
} from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { domainRegexp } from "./ActionExternalMenu";

export const getDuplicatedRenew = (actions) => {
  const _data = JSON.parse(JSON.stringify(actions));
  const duplicatedObjects = new Array();
  _data.forEach((x, idx) => {
    const dupIndex = duplicatedObjects.findIndex(
      (i) =>
        i.tag === x.tag &&
        i.type === x.type &&
        i.from === x.from &&
        i.to === x.to &&
        ["renew", "update"].includes(i.metadata.action)
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
const RenderSocialCard = (props) => {
  const { actions, openModal, owner } = props;
  const resolvedActions = getDuplicatedRenew(actions);
  return (
    <>
      {resolvedActions
        ?.filter(
          (x) => isSameAddress(x.from, owner) || isSameAddress(x.to, owner)
        )
        .map((action) => {
          const metadata = action?.metadata;

          const checkEmojis =
            /^(\p{Emoji}\uFE0F|\p{Emoji_Presentation})+$/gu.test(
              metadata?.body
            );

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
                    <>
                      {(action.duplicatedObjects?.length &&
                        metadata.action === "renew" &&
                        action.duplicatedObjects.map((x, idx) => (
                          <RenderProfileBadge
                            key={`${action.type}_${x.handle}_${
                              x.profile_id + idx
                            }`}
                            identity={x.handle}
                          />
                        ))) || (
                        <RenderProfileBadge identity={metadata.handle} />
                      )}
                    </>
                    {action.platform && (
                      <span className="feed-platform">
                        &nbsp;on {action.platform}
                      </span>
                    )}
                  </div>
                  {action.duplicatedObjects?.map((x) => {
                    return (
                      x.key && (
                        <div className="feed-content">
                          <Link
                            className="feed-target"
                            href={`https://web3.bio/${x.handle}`}
                            target="_blank"
                          >
                            <div className="feed-target-name">
                              <strong>{x.key}</strong>
                            </div>
                            <div className="feed-target-content">{x.value}</div>
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
              if (["Mirror"].includes(action.platform) || metadata.summary) {
                return (
                  <>
                    <div className="feed-content">
                      {
                        ActivityTypeMapping(action.type).action[
                          metadata.action || "default"
                        ]
                      }
                      {action.platform && (
                        <span className="feed-platform">
                          &nbsp;on {action.platform}
                        </span>
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
                          <div className="feed-target-name">
                            <strong>{metadata.title}</strong>
                          </div>
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
                            <strong>{metadata.target?.handle}</strong>
                          </div>
                          <div className="feed-target-content">
                            {metadata.target?.body}
                          </div>
                          {metadata.target?.media?.length > 0 && (
                            <div
                              className={`feed-target-content media-gallery`}
                            >
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
                        {action.platform && (
                          <span className="feed-platform">
                            &nbsp;on {action.platform}
                          </span>
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
                          x.mime_type.includes("image") ? (
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
                          ) : (
                            ""
                          )
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
                            <strong>{metadata.target?.handle}</strong>
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
                                    height="auto"
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
                    )}
                  </>
                );
              }
            case ActivityType.mint:
              return (
                <>
                  <div className="feed-content">
                    {ActivityTypeMapping(action.type).action["post"]}
                    {action.platform && (
                      <span className="feed-platform">
                        &nbsp;on {action.platform}
                      </span>
                    )}
                  </div>
                  <div className="feed-content">
                    <Link
                      className="feed-target"
                      href={action.related_urls[0]}
                      target="_blank"
                    >
                      <div className="feed-target-name">
                        <strong>{metadata.handle}</strong>
                      </div>
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
                    {action.platform && (
                      <span className="feed-platform">
                        &nbsp;on {action.platform}
                      </span>
                    )}
                  </div>
                  {metadata.body && (
                    <div className="feed-content">
                      <Link
                        className="feed-target"
                        href={action.related_urls[0]}
                        target="_blank"
                      >
                        <div className="feed-target-name">
                          <strong>{metadata.title}</strong>
                        </div>
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
                          <strong>{metadata.target?.handle}</strong>
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
        })}
    </>
  );
};

export const SocialCard = memo(RenderSocialCard);
