import { memo, useMemo } from "react";
import { ActionStructMapping } from "../utils/activity";
import RenderProfileBadge from "./RenderProfileBadge";
import { RenderToken } from "../feed/RenderToken";
import { NFTAssetPlayer, isImage, isVideo } from "../shared/NFTAssetPlayer";
import { ModalType } from "../hooks/useModal";
import { resolveMediaURL } from "../utils/utils";
import { PlatformType } from "../utils/platform";
import { domainRegexp } from "../feed/ActionExternalMenu";
import Link from "next/link";
import { resolveIPFS_URL } from "../utils/ipfs";

function RenderFeedActionCard(props) {
  const {
    actions,
    id,
    owner,
    openModal,
    network,
    platform: feedPlatform,
  } = props;
  const renderData = useMemo(() => {
    return actions.map((x) => ({ ...ActionStructMapping(x, owner) }));
  }, [actions, owner]);

  return (
    <div className="feed-item-body" key={id}>
      {renderData.map((x, idx) => {
        const { verb, objects, prep, target, platform, assets, socialDetails } =
          x;
        const checkEmojis =
          /^(\p{Emoji}\uFE0F|\p{Emoji_Presentation})+$/gu.test(verb);
        return (
          <>
            {verb && (
              <div
                className={`feed-content ${checkEmojis ? " text-emoji" : ""}`}
                key={"content_" + id + idx}
              >
                {verb}
                {objects
                  ?.filter((i) => !!i)
                  .map((i, idx) =>
                    typeof i === "string" ? (
                      " " + i
                    ) : i.identity ? (
                      <RenderProfileBadge
                        key={`${id + idx}_${x.name || x.symbol}_${x.value}`}
                        identity={i.identity}
                        platform={i.platform || PlatformType.ens}
                        remoteFetch
                      />
                    ) : (
                      <RenderToken
                        key={`${id + idx}_${x.name || x.symbol}_${x.value}`}
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
                {target && <RenderProfileBadge identity={target} remoteFetch />}
                {platform && <> on {platform}</>}
                {assets?.length > 0 && (
                  <div className="feed-content media-gallery">
                    {assets.map((x, cIdx) => {
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
              </div>
            )}
            {socialDetails && (
              <>
                {socialDetails.content && (
                  <div className="feed-content">
                    <div
                      className="feed-target c-hand"
                      onClick={(e) => {
                        if (socialDetails.content.body) {
                          e.preventDefault();
                          e.stopPropagation();
                          openModal(ModalType.article, {
                            title: socialDetails.content.title,
                            content: socialDetails.content.body,
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
                        {socialDetails.content.title}
                      </div>
                      <div className="feed-target-description">
                        {socialDetails.content.body}
                      </div>
                    </div>
                  </div>
                )}
                {socialDetails.media?.length > 0 && (
                  <div
                    className={`feed-content${
                      socialDetails.media.length > 1 ? " media-gallery" : ""
                    }`}
                  >
                    {socialDetails.media?.map((x) =>
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
                {socialDetails.target && (
                  <div className="feed-content">
                    <Link
                      className="feed-target"
                      href={resolveIPFS_URL(actions[idx].target_url) || ""}
                      target="_blank"
                    >
                      <div className="feed-target-name">
                        <RenderProfileBadge
                          platform={feedPlatform}
                          identity={socialDetails.target?.handle}
                          remoteFetch
                          fullProfile
                        />
                      </div>
                      <div className="feed-target-content">
                        {socialDetails.target?.body}
                      </div>
                      {socialDetails.target?.media?.length > 0 && (
                        <div
                          className={`feed-target-content${
                            socialDetails.target?.media?.length > 1
                              ? " media-gallery"
                              : ""
                          }`}
                        >
                          {socialDetails.target?.media?.map((x) =>
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
                            ) : socialDetails.target?.body ? (
                              ""
                            ) : (
                              x.address
                            )
                          )}
                        </div>
                      )}
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        );
      })}
    </div>
  );
}

export default memo(RenderFeedActionCard);
