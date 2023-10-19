import { memo } from "react";
import useSWR from "swr";
import { simplehashFetcher, SIMPLEHASH_URL } from "../apis/simplehash";
import { formatEther } from "ethers";
import {
  getSocialMediaLink,
  PlatformType,
  SocialPlatformMapping,
} from "../../utils/platform";
import Link from "next/link";

const useCollectionData = (id) => {
  const { data, isValidating, error } = useSWR(
    SIMPLEHASH_URL + "/api/v0/nfts/collections/ids?collection_ids=" + id,
    simplehashFetcher,
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
          className="btn btn-sm btn-primary"
          key={item.collection_id + item}
          target="_blank"
          rel="noopener noreferrer"
        >
          {SocialPlatformMapping(key as PlatformType).label} ↗️
        </Link>
      );
    }
  }

  return links;
};

const INFO_CONFIG = [
  { key: "distinct_nft_count", label: "Total Minted" },
  { key: "total_quantity", label: "Max Supply" },
  { key: "distinct_owner_count", label: "Unique Minters" },
  { key: "category", label: "Category" },
];

const CollectionAboutRender = (props) => {
  const { id } = props;
  const { data, isLoading, isError } = useCollectionData(id);
  if (!data || isLoading || isError) return null;

  const _collection = data?.collections?.[0];
  const floorPriceItem = _collection.floor_prices?.sort(
    (a, b) => a.value - b.value
  )[0];

  return (
    <>
      <div className="panel-widget-content mt-4 mb-4">
        <div className="traits-cards">
          {renderSocialMediaLinks(_collection)}
        </div>
      </div>
      <div className="panel-widget-content">
        <div className="traits-cards">
          {floorPriceItem && (
            <div key="floorPriceItem" className="traits-card traits-card-full">
              <div className="trait-type">Floor Price</div>
              <div className="trait-value">
                {formatEther(BigInt(floorPriceItem?.value))}{" "}
                {floorPriceItem.payment_token.symbol}
              </div>
            </div>
          )}
          {INFO_CONFIG.map((x) => {
            return (
              <>
                {_collection[x.key] && (
                  <div className="traits-card" key={x.key}>
                    <div className="trait-type">{x.label}</div>
                    <div className="trait-value">
                      {_collection[x.key]?.toString()}
                    </div>
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export const CollectionAbout = memo(CollectionAboutRender);
