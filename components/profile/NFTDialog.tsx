import { memo } from "react";
import SVG from "react-inlinesvg";
import { isValidJson } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

export const enum NFTDialogType {
  NFT = "nft",
  POAP = "poap",
}

const NFTDialogRender = (props) => {
  const { onClose, asset, type = NFTDialogType.NFT } = props;
  if (type === "poap")
    return (
      <>
        <div id="nft-dialog" className="nft-preview">
          <div className="preview-overlay" onClick={onClose}></div>
          <div className="preview-container columns">
            <div className="btn btn-close" onClick={onClose}>
              <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
            </div>
            <div className="col-6 col-md-12">
              <div className="preview-image preview-image-poap">
                <NFTAssetPlayer
                  className={"img-container"}
                  type={"image/png"}
                  src={asset.mediaURL}
                  contentUrl={asset.contentURL}
                  alt={asset.asset.event.name}
                />
                <div
                  className="preview-image-bg"
                  style={{ backgroundImage: "url(" + asset.mediaURL + ")" }}
                ></div>
              </div>
            </div>
            <div className="col-6 col-md-12">
              <div className="preview-content">
                <div className="nft-header-collection collection-title">
                  <SVG className="collection-logo" src="../icons/icon-poap.svg" width={24} height={24} />
                  <div className="collection-name text-ellipsis">POAP</div>
                </div>
                <div className="nft-header-name">{asset.asset.event.name}</div>

                {asset.asset.event.event_url && (
                  <div className="panel-widget">
                    <div className="panel-widget-content">
                      <a
                        href={asset.asset.event.event_url}
                        target="_blank"
                        className="btn btn-primary btn-sm"
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
                      {(asset.asset.event.city ||
                        asset.asset.event.country) && (
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
        </div>
      </>
    );
  if (!asset) return null;
  const _asset = asset.asset;
  const metadata = isValidJson(_asset.metadata_json)
    ? JSON.parse(_asset.metadata_json)
    : null;
  const attributes =
    _asset.attributes && _asset.attributes.length > 0
      ? _asset.attributes
      : metadata?.attributes;

  return (
    <>
      <div id="nft-dialog" className="nft-preview">
        <div className="preview-overlay" onClick={onClose}></div>
        <div className="preview-container columns">
          <div className="btn btn-close" onClick={onClose}>
            <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
          </div>
          <div className="col-6 col-md-12">
            <div className="preview-image">
              <NFTAssetPlayer
                className="img-container"
                type={asset.asset.content_type}
                src={asset.mediaURL}
                contentUrl={asset.contentURL}
                alt={asset.collection?.name + _asset.name}
              />
            </div>
          </div>
          <div className="col-6 col-md-12">
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
                {asset.asset.name ||
                  `${asset.collection.name} #${asset.asset.token_id}`}
              </div>
              {metadata?.description && (
                <div className="panel-widget">
                  <div className="panel-widget-content">
                    {metadata?.description}
                  </div>
                </div>
              )}
              {attributes && (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const NFTDialog = memo(NFTDialogRender);
