import React, { useRef, useEffect, useState, memo } from 'react';
import Link from "next/link";
import SVG from "react-inlinesvg";
import Markdown from "react-markdown";
import { formatText, getSocialMediaLink } from "../utils/utils";
import { PlatformType, SocialPlatformMapping } from "../utils/platform";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { formatEther } from "viem";

const INFO_CONFIG = [
  { key: "distinct_nft_count", label: "Total Minted" },
  { key: "total_quantity", label: "Max Supply" },
  { key: "distinct_owner_count", label: "Unique Owners" },
  { key: "category", label: "Category" },
  { key: "chains", label: "Chain" },
];

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
  const collectionLinks = Object.entries(renderArr).filter(([key, item]) => item);

  return collectionLinks.map(([key, item]) => {
    return (
      <Link
        onClick={(e) => e.stopPropagation()}
        href={getSocialMediaLink(item, key as PlatformType) || ""}
        className="btn btn-sm"
        key={key}
        target="_blank"
        rel="noopener noreferrer"
        title={SocialPlatformMapping(key as PlatformType).label}
      >
        <SVG
          src={`../${SocialPlatformMapping(key as PlatformType).icon}`}
          fill="#121212"
          width={18}
          height={18}
        />
        {collectionLinks.length < 4 && SocialPlatformMapping(key as PlatformType).label}
      </Link>
    );
  });
};

const CollectionAboutRender = (props) => {
  const { collection, contract, contractAddress } = props;
  const [expand, setExpand] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const floorPriceItem = collection.floor_prices?.sort(
    (a, b) => a.value - b.value
  )[0];

  useEffect(() => {
    if (descriptionRef.current?.offsetHeight! > 120) {
      setExpand(true);
    }
  }, [descriptionRef]);

  if (!collection) return null;

  return (
    <>
      <div className="panel-section">
        <div className="panel-section-content">
          <div className="nft-logo mt-4 mb-4">
            <NFTAssetPlayer
              type={"image/png"}
              className="collection-logo"
              src={collection.image_url}
              alt={collection.name}
              width={64}
              height={64}
              placeholder
            />
          </div>
          <div className="nft-title h5">
            {collection.name}
          </div>
          {collection.description && (
            <div
              ref={descriptionRef}
              className="nft-description"
              style={{
                maxHeight: expand ? "6rem" : "unset",
              }}
            >
              <div className="content">
                <Markdown>
                  {collection.description}
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
          <div className="nft-actions btn-group">
            {renderSocialMediaLinks(collection)}
          </div>
        </div>
      </div>
      <div className="panel-section">
        <div className="panel-section-content">
          <div className="panel-section-title collection-title">
            Details
          </div>
          <div className="panel-section-list">
            {floorPriceItem && (
              <div className="widget-list-item" key="floorPriceItem">
                <div className="list-item-left">Floor Price</div>
                <div className="list-item-right text-bold">
                  {formatEther(BigInt(floorPriceItem?.value))}{" "}
                  {floorPriceItem.payment_token.symbol}
                </div>
              </div>
            )}
            {INFO_CONFIG.map(({key, label}) => {
              if (collection[key]) {
                return (
                  <div className="widget-list-item" key={key}>
                    <div className="list-item-left">{label}</div>
                    <div className="list-item-right text-bold text-uppercase">
                      {collection[key]?.toString()}
                    </div>
                  </div>
                );
              }
            })}
            {contractAddress && (
              <div className="widget-list-item" key="contractAddress">
                <div className="list-item-left">Contract Address</div>
                <div className="list-item-right text-bold">
                  <a href={`https://etherscan.io/address/${contractAddress}`} target="_blank">
                    {formatText(contractAddress)} ↗️
                  </a>
                </div>
              </div>
            )}
            {contract.type && (
              <div className="widget-list-item" key="contractType">
                <div className="list-item-left">NFT Standard</div>
                <div className="list-item-right text-bold">
                  {contract.type}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const CollectionAbout = memo(CollectionAboutRender);
