import { memo, useEffect } from "react";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { CollectionAbout } from "./CollectionAbout";
import { PlatformType } from "../../utils/platform";
import { getSocialMediaLink, SocialPlatformMapping, NetworkMapping, formatText } from "../../utils/utils";

export const enum NFTModalType {
  NFT = "nft",
  POAP = "poap",
}

const renderSocialMediaLinks = (_collection) => {
  const renderArr = {
    [PlatformType.website]: _collection.external_url,
    [PlatformType.twitter]: _collection.twitter_username,
    [PlatformType.medium]: _collection.medium_username,
    [PlatformType.telegram]: _collection.telegram_url,
    [PlatformType.opensea]: _collection.marketplace_pages?.find(
      (x) => x.marketplace_id === PlatformType.opensea
    )?.collection_url,
    [PlatformType.discord]: _collection.discord_url,
    [PlatformType.instagram]: _collection.instagram_username,
  };

  const links = new Array();
  for (let key in renderArr) {
    if (renderArr[key]) {
      const item = renderArr[key];
      links.push(
        <Link
          href={getSocialMediaLink(item, key as PlatformType) || ""}
          className="btn"
          key={key + item}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SVG src={`../${SocialPlatformMapping(key as PlatformType).icon}`} fill="#121212" width={20} height={20} />
        </Link>
      );
    }
  }
  return links;
};

const NFTModalRender = (props) => {
  const { onClose, asset, type = NFTModalType.NFT } = props;

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => document.removeEventListener("keydown", keyDownHandler);
  });

  if (type === "poap")
    return (
      <>
        <div id="nft-dialog" className="nft-preview">
          <div className="preview-container">
            <div
              className="preview-overlay"
              style={{
                backgroundImage: "url(" + asset.mediaURL + ")",
              }}
              onClick={onClose}
            ></div>
            <div className="btn btn-close" onClick={onClose}>
              <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
            </div>
            <div className="preview-image preview-image-poap">
              <NFTAssetPlayer
                className={"img-container"}
                type={"image/png"}
                src={asset.mediaURL}
                alt={asset.asset.event.name}
              />
            </div>
            <div className="preview-content">
              <div className="panel-widget">
                <div className="nft-header-collection collection-title mb-4">
                  <SVG
                    className="collection-logo"
                    src="../icons/icon-poap.svg"
                    width={24}
                    height={24}
                  />
                  <div className="collection-name text-ellipsis">POAP</div>
                </div>
                <div className="nft-header-name h4">{asset.asset.event.name}</div>
                <div className="nft-header-description mt-4 mb-4">
                  {asset.asset.event.description}
                </div>
                {asset.asset.event.event_url && (
                  <div className="panel-widget-content mt-4 mb-4">
                    <Link
                      href={asset.asset.event.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      <SVG src={`../icons/icon-web.svg`} fill="#121212" width={20} height={20} />
                      <span className="ml-1">Website</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="panel-widget">
                <div className="panel-widget-title">Attributes</div>
                <div className="panel-widget-content">
                  <div className="panel-widget-list">
                    <div className="widget-list-item">
                      <div className="list-item-left">Event Start</div>
                      <div className="list-item-right">
                        {asset.asset.event.start_date}
                      </div>
                    </div>
                    {(asset.asset.event.city || asset.asset.event.country) && (
                      <div className="widget-list-item">
                        <div className="list-item-left">Event Location</div>
                        <div className="list-item-right">
                          {asset.asset.event.city} {asset.asset.event.country}
                        </div>
                      </div>
                    )}
                    <div className="widget-list-item">
                      <div className="list-item-left">Chain</div>
                      <div className="list-item-right">
                        {asset.asset.chain}
                      </div>
                    </div>
                    <div className="widget-list-item">
                      <div className="list-item-left">POAP Supply</div>
                      <div className="list-item-right">
                        {asset.asset.event.supply}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  if (!asset) return null;
  const _asset = asset.asset;
  const _collection = asset.asset.collection;
  const attributes = _asset.extra_metadata?.attributes || [];
  return (
    <>
      <div
        id="nft-dialog"
        className="nft-preview"
        style={{
          ["--nft-primary-color" as string]: _asset.previews.predominant_color,
        }}
      >
        <div className="preview-container">
          <div
            className="preview-overlay"
            style={{
              backgroundImage: "url(" + _asset.previews.image_medium_url + ")",
            }}
            onClick={onClose}
          ></div>

          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
          <div className="preview-image">
            <NFTAssetPlayer
              className="img-container"
              type={
                _asset.video_url
                  ? _asset.video_properties.mime_type || "video/mp4"
                  : "image/png"
              }
              src={asset.mediaURL}
              alt={asset.collection?.name + _asset.name}
              poster={_asset.previews.image_large_url}
            />
            
            <div
              className={`preview-network ${_asset.chain}`}
              title={NetworkMapping(_asset.chain).label}
            >
              <SVG
                fill={"#fff"}
                src={NetworkMapping(_asset.chain).icon || ""}
                className="preview-network-icon"
              />
              <span className="preview-network-name">
                {NetworkMapping(_asset.chain).label}
              </span>
            </div>
          </div>
          <div className="preview-main">
            <div className="preview-content">
              <div className="panel-widget">
                <div className="nft-header-collection collection-title mb-4">
                  <NFTAssetPlayer
                    type={"image/png"}
                    className="collection-logo"
                    src={asset.collection.url}
                    alt={asset.collection.name}
                  />
                  <div className="collection-name text-ellipsis">
                    {asset.collection.name}
                  </div>
                </div>
                <div className="nft-header-name h4">
                  {_asset.name || `${asset.collection.name} #${_asset.token_id}`}
                </div>
                <div className="nft-header-description mt-4 mb-4">
                  {_asset.description || asset.collection.description}
                </div>

                <div className="panel-widget-content mt-4 mb-4">
                  <div className="btn-group">
                    {renderSocialMediaLinks(_collection)}
                  </div>
                </div>

                {attributes.length > 0 && (
                  <div className="panel-widget">
                    <div className="panel-widget-title collection-title">
                      Attributes
                    </div>
                    <div className="panel-widget-content">
                      <div className="traits-cards">
                        {attributes.map((x, idx) => {
                          return (
                            <div key={(x.attribute_name || x.trait_type) + idx} className="traits-card">
                              <div className="trait-type">
                                {x.attribute_name || x.trait_type}
                              </div>
                              <div className="trait-value">
                                {x.attribute_value || x.value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="divider"></div>
                <CollectionAbout collection={_collection} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const NFTModal = memo(NFTModalRender);
