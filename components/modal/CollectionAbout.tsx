import { memo } from "react";
import Markdown from "react-markdown";
import { formatText } from "../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { formatEther } from "viem";

const INFO_CONFIG = [
  { key: "distinct_nft_count", label: "Total Minted" },
  { key: "total_quantity", label: "Max Supply" },
  { key: "distinct_owner_count", label: "Unique Minters" },
  { key: "category", label: "Category" },
  { key: "chains", label: "Chain" },
];

const CollectionAboutRender = (props) => {
  const { collection } = props;
  if (!collection) return null;

  const floorPriceItem = collection.floor_prices?.sort(
    (a, b) => a.value - b.value
  )[0];

  return (
    <div className="panel-section">
      <div className="panel-section-content">
        <div className="nft-logo mb-4">
          <NFTAssetPlayer
            type={"image/png"}
            className="collection-logo"
            src={collection.image_url}
            alt={collection.name}
            width={48}
            height={48}
            placeholder
          />
        </div>
        <div className="nft-name h5">
          {collection.name}
        </div>
        {collection.description && (
          <div className="nft-description">
            <Markdown>
              {collection.description}
            </Markdown>
          </div>
        )}
      </div>
      <div className="panel-section-content">
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
          {collection.address && (
            <div className="widget-list-item" key="contractAddress">
              <div className="list-item-left">Contract Address</div>
              <div className="list-item-right text-bold">
                <a href={`https://etherscan.io/address/${collection.address}`} target="_blank">
                  {formatText(collection.address)} ↗️
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CollectionAbout = memo(CollectionAboutRender);
