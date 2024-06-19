import { memo, useMemo } from "react";
import { ActionStructMapping } from "../utils/activity";
import { RenderToken } from "../feed/RenderToken";
import { NFTAssetPlayer, isImage, isVideo } from "../shared/NFTAssetPlayer";
import { ModalType } from "../hooks/useModal";
import { resolveMediaURL } from "../utils/utils";
import { PlatformType } from "../utils/platform";
import { domainRegexp } from "../feed/ActionExternalMenu";
import Link from "next/link";
import { resolveIPFS_URL } from "../utils/ipfs";
import RenderProfileBadge from "../profile/RenderProfileBadge";

function RenderFeedActionCard(props) {
  const {
    actions,
    id,
    owner,
    overridePlatform,
    openModal,
    network,
    platform: feedPlatform,
  } = props;
  const renderData = useMemo(() => {
    return actions.map((x) => ({ ...ActionStructMapping(x, owner) }));
  }, [actions]);

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
    return (
      <>
        <div
          className={`feed-content ${checkEmojis ? " text-emoji" : ""}`}
          key={"content_" + id + idx}
        >
          {verb}
          {objects
            ?.filter((i) => !!i)
            .map((i, idx) =>
              i.text ? (
                <span
                  className={i.isToken ? "feed-token" : ""}
                  key={`text_object_${idx}`}
                >
                  {" "}
                  {i.text}
                </span>
              ) : i.identity ? (
                <RenderProfileBadge
                  key={`${id + idx}_${i.name || i.symbol}_${i.value}`}
                  identity={i.identity}
                  platform={i.platform || PlatformType.ens}
                  remoteFetch
                />
              ) : (
                <RenderToken
                  key={`${id + idx}_${i.name || i.symbol}_${i.value}`}
                  name={i.name}
                  symbol={i.symbol}
                  image={i.image}
                  network={network}
                  openModal={openModal}
                  standard={i.standard}
                  value={{
                    value: i.value,
                    decimals: i.decimals,
                  }}
                  asset={i}
                />
              )
            )}
          {prep && prep}
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
            {attachments.nfts?.length > 0 && (
              <div className="feed-content media-gallery">
                {attachments.nfts.map((x, cIdx) => {
                  return (
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
                  );
                })}
              </div>
            )}
            {attachments.profiles?.length > 0 &&
              attachments.profiles.map((x) => (
                <div
                  key={`profile_content_${idx}_${x.handle}`}
                  className="feed-content"
                >
                  <Link className="feed-target" href={x.url} target="_blank">
                    <div className="feed-target-name">{x.key}</div>
                    <div className="feed-target-content">{x.value}</div>
                    {x.handle && (
                      <div className="feed-target-address">{x.handle}</div>
                    )}
                  </Link>
                </div>
              ))}
            {attachments.social && (
              <>
                {attachments.social.content && (
                  <div
                    className="feed-target c-hand"
                    onClick={(e) => {
                      if (attachments.social.content.body) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(ModalType.article, {
                          title: attachments.social.content.title,
                          content: attachments.social.content.body,
                          baseURL: `https://${
                            domainRegexp.exec(
                              actions[idx].content_uri ||
                                actions[idx].related_urls[0]
                            )?.[1]
                          }`,
                          link: actions[idx].content_uri,
                        });
                      }
                    }}
                  >
                    <div className="feed-target-name">
                      {attachments.social.content.title}
                    </div>
                    <div className="feed-target-description">
                      {attachments.social.content.body}
                    </div>
                  </div>
                )}
                {attachments.social.media?.length > 0 && (
                  <div
                    className={`feed-content${
                      attachments.social.media.length > 1
                        ? " media-gallery"
                        : ""
                    }`}
                  >
                    {attachments.social.media?.map((x) =>
                      isImage(x.mime_type) || isVideo(x.mime_type) ? (
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
                {attachments.social.target && (
                  <Link
                    className="feed-target"
                    href={resolveIPFS_URL(actions[idx].target_url) || ""}
                    target="_blank"
                  >
                    <div className="feed-target-name">
                      <RenderProfileBadge
                        platform={feedPlatform}
                        identity={attachments.social.target?.handle}
                        remoteFetch
                        fullProfile
                      />
                    </div>
                    <div className="feed-target-content">
                      {attachments.social.target?.body}
                    </div>
                    {attachments.social.target?.media?.length > 0 && (
                      <div
                        className={`feed-target-content${
                          attachments.social.target?.media?.length > 1
                            ? " media-gallery"
                            : ""
                        }`}
                      >
                        {attachments.social.target?.media?.map((x) =>
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
                          ) : attachments.social.target?.body ? (
                            ""
                          ) : (
                            x.address
                          )
                        )}
                      </div>
                    )}
                  </Link>
                )}
              </>
            )}
            {attachments.url && (
              <Link
                className="feed-target"
                href={attachments.url}
                target="_blank"
              >
                <div className="feed-target-name">{attachments.title}</div>
                <div className="feed-target-content">
                  {attachments.image && (
                    <NFTAssetPlayer
                      className="feed-content-img float-right"
                      src={attachments.image}
                      height={40}
                      width={40}
                      placeholder={true}
                      type={"image/png"}
                      alt={attachments.title}
                    />
                  )}
                  <div className="feed-target-description">
                    {attachments.body}
                    {attachments.subTitle && (
                      <small className="text-gray-dark">
                        ({attachments.subTitle})
                      </small>
                    )}
                  </div>
                </div>
              </Link>
            )}
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
