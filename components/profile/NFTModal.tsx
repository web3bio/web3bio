import { memo, useEffect } from "react";
import SVG from "react-inlinesvg";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { CollectionWidget } from "./CollectionWidget";

export const enum NFTModalType {
  NFT = "nft",
  POAP = "poap",
}

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
              <div className="nft-header-collection collection-title">
                <SVG
                  className="collection-logo"
                  src="../icons/icon-poap.svg"
                  width={24}
                  height={24}
                />
                <div className="collection-name text-ellipsis">POAP</div>
              </div>
              <div className="nft-header-name">{asset.asset.event.name}</div>
              {asset.asset.event.event_url && (
                <div className="panel-widget">
                  <div className="panel-widget-content">
                    <a
                      href={asset.asset.event.event_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                    >
                      Website
                    </a>
                  </div>
                </div>
              )}

              {asset.asset.event.description && (
                <div className="panel-widget">
                  <div className="panel-widget-content">
                    {asset.asset.event.description}
                  </div>
                </div>
              )}

              <div className="panel-widget">
                <div className="panel-widget-title">Attributes</div>
                <div className="panel-widget-content">
                  <div className="traits-cards">
                    <div className="traits-card">
                      <div className="trait-type">Event Start</div>
                      <div className="trait-value">
                        {asset.asset.event.start_date}
                      </div>
                    </div>
                    {(asset.asset.event.city || asset.asset.event.country) && (
                      <div className="traits-card">
                        <div className="trait-type">Event Location</div>
                        <div className="trait-value">
                          {asset.asset.event.city} {asset.asset.event.country}
                        </div>
                      </div>
                    )}
                    <div className="traits-card">
                      <div className="trait-type">POAP Supply</div>
                      <div className="trait-value">
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
          </div>
          <div className="preview-main">
            <div className="preview-content">
              <div className="nft-header-collection collection-title">
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
              <div className="nft-header-name">
                {_asset.name || `${asset.collection.name} #${_asset.token_id}`}
              </div>
              {_asset?.description || asset.collection.description && (
                <div className="panel-widget">
                  <div className="panel-widget-content">
                    {_asset?.description || asset.collection.description}
                  </div>
                </div>
              )}
              {attributes.length > 0 && (
                <div className="panel-widget">
                  <div className="panel-widget-title">Attributes</div>
                  <div className="panel-widget-content">
                    <div className="traits-cards">
                      {attributes.map((x, idx) => {
                        return (
                          <div key={idx} className="traits-card">
                            <div className="trait-type">
                              {x.attribute_name || x.trait_type}
                            </div>
                            <div className="trait-value">
                              {x.attribute_value || x.value}
                            </div>
                            {/* {x.percentage && (
                              <div className="trait-trait_percentage">
                                {x.percentage}
                              </div>
                            )} */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="panel-widget">
                <div className="panel-widget-title collection-title mt-4">
                  <NFTAssetPlayer
                    type={"image/png"}
                    className="collection-logo"
                    src={asset.collection.url}
                    alt={asset.collection.name}
                  />
                  About {asset.collection.name}
                </div>
                <div className="panel-widget-content">
                  {asset.collection.description}
                </div>

                <CollectionWidget address={asset.collection.address} id={asset.collection.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const NFTModal = memo(NFTModalRender);
