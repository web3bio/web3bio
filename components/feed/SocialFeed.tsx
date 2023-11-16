import Link from "next/link";
import { memo } from "react";
import { ModalType } from "../../hooks/useModal";
import { ActivityType } from "../../utils/activity";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { ActivityTypeMapping, resolveMediaURL } from "../../utils/utils";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderSocialCard = (props) => {
  const { action, openModal } = props;
  const metadata = action?.metadata;
  const checkEmojis = /^(\p{Emoji}\uFE0F|\p{Emoji_Presentation})+$/gu.test(
    metadata?.body
  );

  switch (action.type) {
    case ActivityType.profile:
      return (
        <>
          <div className="feed-content">
            {
              ActivityTypeMapping(action.type).action[
                metadata.action || "default"
              ]
            }
            &nbsp;
            <RenderProfileBadge identity={metadata.handle} />
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
          {metadata.key && (
            <div className="feed-content">
              <Link
                className="feed-target"
                href={`https://web3.bio/${metadata.handle}`}
                target="_blank"
              >
                <div className="feed-target-name">
                  <strong>{metadata.key}</strong>
                </div>
                <div className="feed-target-content">{metadata.value}</div>
              </Link>
            </div>
          )}
        </>
      );
    case ActivityType.post:
    case ActivityType.comment:
      if (
        ["Farcaster", "Lens"].includes(action.platform) &&
        (metadata.body || metadata.media?.length)
      ) {
        return (
          <>
            {metadata?.body && (
              <div
                className={`feed-content text-large${
                  checkEmojis ? " text-emoji" : ""
                }`}
              >
                {metadata?.body}
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
      } else {
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
            {metadata.body || metadata.media?.length ? (
              <div className="feed-content">
                <Link
                  className="feed-target"
                  href={action.related_urls[0]}
                  target="_blank"
                >
                  <div className="feed-target-name">
                    <strong>{metadata.title || metadata.handle}</strong>
                  </div>
                  <div
                    className="feed-target-content"
                    onClick={(e) => {
                      if (metadata.body) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(ModalType.article, {
                          ctx: metadata.body,
                          title: metadata.title,
                        });
                      }
                    }}
                  >
                    {metadata.summary || metadata.body}
                  </div>
                  {metadata.media?.length > 0 && (
                    <div
                      className={`feed-target-content${
                        metadata.media?.length > 1 ? " media-gallery" : ""
                      }`}
                    >
                      {metadata.media?.map((x) =>
                        x.mime_type.includes("image") ||
                        x.mime_type.includes("video") ? (
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
                            alt={metadata.body}
                          />
                        ) : (
                          ""
                        )
                      )}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              ""
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
              <span className="feed-platform">&nbsp;on {action.platform}</span>
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
                        alt={metadata.body}
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
              <span className="feed-platform">&nbsp;on {action.platform}</span>
            )}
          </div>
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
};

export const SocialCard = memo(RenderSocialCard);
