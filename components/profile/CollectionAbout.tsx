import { memo } from "react";
import { formatEther } from "ethers";
import { formatText } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const INFO_CONFIG = [
  { key: "distinct_nft_count", label: "Total Minted" },
  { key: "total_quantity", label: "Max Supply" },
  { key: "distinct_owner_count", label: "Unique Minters" },
  { key: "category", label: "Category" },
  { key: "chains", label: "Chain" },
];

const CollectionAboutRender = (props) => {
  const { collection } = props;
  console.log(collection)
  if (!collection) return null;

  const floorPriceItem = collection.floor_prices?.sort(
    (a, b) => a.value - b.value
  )[0];

  return (
    <div className="panel-widget">
      <div className="panel-widget-title collection-title">
        Collection
      </div>
      <div className="panel-widget-content">
        <div className="nft-header-logo mt-4 mb-4">
          <NFTAssetPlayer
            type={"image/png"}
            className="collection-logo"
            src={collection.image_url}
            alt={collection.name}
          />
        </div>
        <div className="nft-header-name h5">
          {collection.name}
        </div>
        {collection.description && (
          <div className="nft-header-description mt-4 mb-4">
            {collection.description}
          </div>
        )}
      </div>
      <div className="panel-widget-content">
        <div className="panel-widget-list">
          {floorPriceItem && (
            <div className="widget-list-item" key="floorPriceItem">
              <div className="list-item-left">Floor Price</div>
              <div className="list-item-right">
                {formatEther(BigInt(floorPriceItem?.value))}{" "}
                {floorPriceItem.payment_token.symbol}
              </div>
            </div>
          )}
          {INFO_CONFIG.map((x, idx) => {
            if (collection[x.key]) {
              return (
                <div className="widget-list-item" key={`${x.key}-${idx}`}>
                  <div className="list-item-left">{x.label}</div>
                  <div className="list-item-right">
                    {collection[x.key]?.toString()}
                  </div>
                </div>
              );
            }
          })}
          {collection.address && (
            <div className="widget-list-item" key="contractAddress">
              <div className="list-item-left">Contract Address</div>
              <div className="list-item-right">
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
