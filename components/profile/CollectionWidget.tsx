import { memo, useState } from "react";
import useSWR from "swr";
import { _fetcher } from "../apis/ens";
import { SIMPLE_HASH_URL } from "../apis/simplehash";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { formatEther } from "ethers";
import {
  getSocialMediaLink,
  PlatformType,
  SocialPlatformMapping,
} from "../../utils/platform";
import Link from "next/link";
import { formatText, getEtherScanLink } from "../../utils/utils";

const useCollectionData = (id) => {
  const { data, isValidating, error } = useSWR(
    SIMPLE_HASH_URL + "/api/v0/nfts/collections/ids?collection_ids=" + id,
    _fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  return {
    data,
    isLoading: isValidating,
    isError: error,
  };
};
const mediaRender = (_collection) => {
  const renderArr = {
    [PlatformType.twitter]: _collection.twitter_username,
    [PlatformType.medium]: _collection.medium_username,
    [PlatformType.telegram]: _collection.telegram_url,
    [PlatformType.opensea]: _collection.marketplace_pages.find(
      (x) => x.marketplace_id === PlatformType.opensea
    )?.collection_url,
    [PlatformType.discord]: _collection.discord_url,
    [PlatformType.instagram]: _collection.instagram_username,
  };

  return Object.keys(renderArr).map((x: PlatformType) => {
    if (renderArr[x]) {
      const item = renderArr[x];
      return (
        <div className="media-item" key={item.collection_id}>
          <Link href={getSocialMediaLink(item, x)}>
            <NFTAssetPlayer
              className="media-img"
              src={SocialPlatformMapping(x).icon}
              alt=""
            />
          </Link>
        </div>
      );
    }
  });
};

const INFO_CONFIG = [
  { key: "distinct_nft_count", label: "Total Minted" },
  { key: "total_quantity", label: "Max Supply" },
  { key: "distinct_owner_count", label: "Unique Minters" },
  { key: "top_contracts", label: "Top Holder" },
];

const CollectionWidgetRender = (props) => {
  const { id, address } = props;
  const { data, isLoading, isError } = useCollectionData(id);
  const [readMore, setReadMore] = useState(false);
  if (!data || isLoading || isError) return null;

  const _collection = data?.collections?.[0];
  const floorPriceItem = _collection.floor_prices?.sort(
    (a, b) => a.value - b.value
  )[0];
  return (
    <div className="preview-content">
      <div className="collection-header">
        <div className="collection-title">
          <NFTAssetPlayer
            type={"image/png"}
            className="collection-logo"
            src={_collection.image_url}
            alt={_collection.name}
          />
          <div className="collection-base-info">
            <div className="collection-name">{_collection.name}</div>
            <Link
              href={getEtherScanLink(address)}
              className="collection-address"
            >
              {formatText(address)}
            </Link>
            <div className="collection-media">{mediaRender(_collection)}</div>
          </div>
        </div>
      </div>
      {floorPriceItem && (
        <div className="collection-price">
          Floor Price: {formatEther(floorPriceItem.value.toString() ?? 0)}{" "}
          {floorPriceItem.payment_token.symbol}
        </div>
      )}
      <div className="collection-description">
        <div
          className={
            readMore
              ? "description-content display-ellipsis"
              : "description-content"
          }
        >
          {_collection.description || "No Descriptions"}{" "}
        </div>
        {_collection.description?.length > 20 && (
          <div className="read-more" onClick={() => setReadMore(!readMore)}>
            {readMore ? "Read less" : "Read more"}
          </div>
        )}
      </div>

      <div className="collection-info">
        {INFO_CONFIG.map((x) => {
          return (
            <div className="info-item" key={x.key}>
              <div className="info-name">{x.label}</div>
              {x.key === "top_contracts" ? (
                <Link
                  href={getEtherScanLink(
                    _collection[x.key]?.[0].replace("ethereum.", "")
                  )}
                  className="info-value"
                >
                  {formatText(_collection[x.key]?.[0], 16).replace(
                    "ethereum.",
                    ""
                  )}
                </Link>
              ) : (
                <div className="info-value">
                  {_collection[x.key].toString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CollectionWidget = memo(CollectionWidgetRender);
