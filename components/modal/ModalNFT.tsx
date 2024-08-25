import React, { useRef, useEffect, useState } from 'react';
import SVG from "react-inlinesvg";
import Markdown from "react-markdown";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { CollectionAbout } from "./CollectionAbout";
import useSWR from "swr";
import { Network, NetworkMapping } from "../utils/network";
import { SIMPLEHASH_URL, SimplehashFetcher } from "../utils/api";

export default function NFTModalContentRender(props) {
  const { onClose, asset } = props;

  const descriptionRef = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (descriptionRef.current?.offsetHeight! > 120) {
      setExpand(true);
    }
  }, [descriptionRef]);

  const resolvedNetwork = (() => {
    if (asset.network?.includes("arbitrum")) {
      return Network.arbitrum;
    }
    return asset.network;
  })();

  const { data: fetchedAsset } = useSWR(
    asset?.remoteFetch
      ? SIMPLEHASH_URL +
          `/api/v0/nfts/${resolvedNetwork}/${asset.contractAddress}/${asset.tokenId}`
      : null,
    SimplehashFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (!asset || (asset.remoteFetch && !fetchedAsset)) return null;

  const _asset = fetchedAsset || asset.asset;
  const _collection = fetchedAsset
    ? fetchedAsset.collection
    : _asset.collection;
  const _contract = fetchedAsset
    ? fetchedAsset.contract
    : _asset.contract;

  const nft_name = _asset.name || `${_collection?.name} #${_asset.token_id}`;
  const nft_description = _asset.description || _collection?.description;
  const attributes = _asset.extra_metadata?.attributes || [];
  const mediaURL =
    _asset?.video_url ||
    _asset?.previews?.image_large_url ||
    _asset?.image_url ||
    _collection?.image_url ||
    asset.mediaURL;

  return (
    <>
      <div className="modal-actions">
        <button className="btn btn-close" onClick={onClose}>
          <SVG src={"/icons/icon-close.svg"} width="20" height="20" />
        </button>
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
          </div>
          <div className="preview-main">
            <div className="preview-content">
              <div className="panel-section">
                <div className="panel-section-content">
                  <div className="nft-collection">
                    <NFTAssetPlayer
                      type={"image/png"}
                      className="collection-logo"
                      src={_collection?.image_url}
                      alt={_collection?.name}
                      width={32}
                      height={32}
                    />
                    <div className="collection-name text-ellipsis">
                      {_collection?.name}
                    </div>
                  </div>
                  <div className="nft-title h4">
                    {nft_name}
                  </div>
                  <div className="nft-subtitle">
                    On 
                    <div
                      className={`nft-network ${_asset.chain}`}
                      title={NetworkMapping(_asset.chain).label}
                    >
                      <SVG
                        fill={NetworkMapping(_asset.chain).primaryColor}
                        src={NetworkMapping(_asset.chain).icon || ""}
                        className="nft-network-icon"
                      />
                      <span className="nft-network-name">
                        {NetworkMapping(_asset.chain).label}
                      </span>
                    </div>
                    
                  </div>
                  {nft_description && (
                    <div 
                      ref={descriptionRef}
                      className="nft-description"
                      style={{
                        maxHeight: expand ? "6rem" : "unset",
                      }}
                    >
                      <div className="content">
                        <Markdown>
                          {nft_description}
                        </Markdown>
                      </div>

                      {expand && (
                        <div
                          className="btn-list-more"
                          onClick={() => {
                            setExpand(false);
                          }}
                        >
                          <button className="btn btn-sm">View More</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {attributes.length > 0 && (
                <>
                  <div className="panel-section">
                    <div className="panel-section-title collection-title">
                      Attributes
                    </div>
                    <div className="panel-section-content">
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
                </>
              )}

              <div className="divider mt-4 mb-4"></div>
              
              <CollectionAbout collection={_collection} contract={_contract} contractAddress={_asset.contract_address} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
