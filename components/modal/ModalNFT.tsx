import Link from "next/link";
import SVG from "react-inlinesvg";
import Markdown from "react-markdown";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { CollectionAbout } from "../profile/CollectionAbout";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { getSocialMediaLink } from "../utils/utils";
import useSWR from "swr";
import { SimplehashFetcher, SIMPLEHASH_URL } from "../apis/simplehash";
import { NetworkMapping } from "../utils/network";

const renderSocialMediaLinks = (_collection) => {
  const renderArr = {
    [PlatformType.website]: _collection?.external_url,
    [PlatformType.twitter]: _collection?.twitter_username,
    [PlatformType.medium]: _collection?.medium_username,
    [PlatformType.telegram]: _collection?.telegram_url,
    [PlatformType.opensea]: _collection?.marketplace_pages?.find(
      (x) => x.marketplace_id === PlatformType.opensea
    )?.collection_url,
    [PlatformType.discord]: _collection?.discord_url,
    [PlatformType.instagram]: _collection?.instagram_username,
  };

  const links = new Array();
  for (let key in renderArr) {
    if (renderArr[key]) {
      const item = renderArr[key];
      links.push(
        <Link
          href={getSocialMediaLink(item, key as PlatformType) || ""}
          className="btn"
          key={key}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SVG
            src={`../${SocialPlatformMapping(key as PlatformType).icon}`}
            fill="#121212"
            width={20}
            height={20}
          />
        </Link>
      );
    }
  }
  return links;
};

export default function NFTModalContentRender(props) {
  const { onClose, asset } = props;

  const { data: fetchedAsset, isValidating } = useSWR(
    asset?.remoteFetch
      ? SIMPLEHASH_URL +
          `/api/v0/nfts/${asset.network}/${asset.contractAddress}/${asset.tokenId}`
      : null,
    SimplehashFetcher
  );

  if (!asset || (asset.remoteFetch && !fetchedAsset)) return null;

  const _asset = fetchedAsset ? fetchedAsset : asset.asset;
  const _collection = fetchedAsset
    ? fetchedAsset.collection
    : _asset.collection;

  const attributes = _asset.extra_metadata?.attributes || [];
  const mediaURL =
    fetchedAsset?.video_url ||
    fetchedAsset?.previews?.image_large_url ||
    fetchedAsset?.image_url ||
    asset.mediaURL;
  return (
    <>
      <div className="modal-actions">
        <div className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </div>
      </div>
      <div
        id="nft-dialog"
        className="nft-preview"
        style={{
          ["--nft-primary-color" as string]:
            _asset.previews?.predominant_color || "#000",
        }}
      >
        <div className="preview-container">
          <div
            className="preview-overlay"
            style={{
              backgroundImage: "url(" + _asset.previews?.image_medium_url + ")",
            }}
            onClick={onClose}
          ></div>
          <div className="preview-image">
            <NFTAssetPlayer
              className="img-container"
              type={
                _asset.video_url
                  ? _asset.video_properties.mime_type || "video/mp4"
                  : "image/png"
              }
              src={mediaURL}
              placeholder={true}
              alt={_collection?.name + _asset.name}
              poster={_asset.previews?.image_large_url}
            />

            <div
              className={`preview-network ${_asset.chain}`}
              title={NetworkMapping(_asset.chain).label}
              style={{ backgroundColor: NetworkMapping(_asset.chain).bgColor }}
            >
              <SVG
                fill={NetworkMapping(_asset.chain).primaryColor}
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
                <div className="panel-widget-content">
                  <div className="nft-header-collection collection-title mb-4">
                    <NFTAssetPlayer
                      type={"image/png"}
                      className="collection-logo"
                      src={_collection?.image_url}
                      alt={_collection?.name}
                      width={24}
                      height={24}
                    />
                    <div className="collection-name text-ellipsis">
                      {_collection?.name}
                    </div>
                  </div>
                  <div className="nft-header-name h4">
                    {_asset.name || `${_collection?.name} #${_asset.token_id}`}
                  </div>
                  <div className="nft-header-description mt-2 mb-2">
                    <Markdown>
                      {_asset.description || _collection?.description}
                    </Markdown>
                  </div>

                  <div className="btn-group mt-2 mb-4">
                    {renderSocialMediaLinks(_collection)}
                  </div>
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
                          <div
                            key={(x.attribute_name || x.trait_type) + idx}
                            className="traits-card"
                          >
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
    </>
  );
}
