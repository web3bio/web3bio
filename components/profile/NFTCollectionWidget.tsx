import { memo, useEffect, useMemo, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";
import { _fetcher } from "../apis/ens";
import { SIMPLE_HASH_URL } from "../apis/simplehash";

export const NFT_PAGE_SIZE = 40;

export const processNFTsData = (data) => {
  const uniqueValues = new Set();
  const result = [];

  for (const obj of data) {
    const nfts = obj.nfts;
    if (!nfts) {
      continue;
    }

    for (const value of nfts) {
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        result.push(value);
      }
    }
  }

  const issues = result;

  if (!issues || issues.length === 0) {
    return [];
  }

  const collections = [];
  const collectionById = new Map();
  for (const issue of issues) {
    const { collection } = issue;
    if (!collection || collection.spam_score > 75) continue;

    let collectionItem = collectionById.get(collection.collection_id);
    if (!collectionItem) {
      collectionItem = { ...collection, assets: [] };
      collectionById.set(collection.collection_id, collectionItem);
      collections.push(collectionItem);
    }

    collectionItem.assets.push(issue);
  }

  return collections;
};

const getURL = (index, address, previous) => {
  if (
    index !== 0 &&
    previous &&
    (!previous.nfts.length || !previous?.next_cursor)
  )
    return null;
  const cursor = previous?.next_cursor || "";
  return (
    SIMPLE_HASH_URL +
    `/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${address}${
      cursor ? "&cursor=" + cursor : ""
    }&limit=${NFT_PAGE_SIZE}`
  );
};

function useNFTs(address: string, initialData) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous),
    _fetcher,
    initialData && {
      initialSize: 1,
      fallbackData: [initialData],
      revalidateOnFocus: false,
      revalidateOnMount: false,
    }
  );
  return {
    hasNextPage: !!data?.[data.length - 1]?.next,
    data: processNFTsData(data),
    isLoading: !error && !data,
    isError: error,
    size,
    isValidating,
    setSize,
  };
}

const RenderNFTCollectionWidget = (props) => {
  const { address, onShowDetail, initialData } = props;
  const { data, size, setSize, isValidating, isError, hasNextPage } = useNFTs(
    address,
    initialData
  );
  const [expand, setExpand] = useState(false);
  const scrollContainer = useRef(null);
  if (!data.length || isError) return null;

  return (
    <div ref={scrollContainer} className="profile-widget-full" id="nft">
      <div
        className={`profile-widget profile-widget-nft${
          expand ? " active" : ""
        }`}
      >
        <ExpandController
          expand={expand}
          onToggle={() => {
            setExpand(!expand);
          }}
        />
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">🖼</span>
          NFT Collections
        </h2>
        <NFTCollections
          handleScrollToAsset={(ref, v) => {
            setExpand(true);
            setTimeout(() => {
              if (ref) {
                const anchorElement = document.getElementById(v);
                if (!anchorElement) return;
                const top = anchorElement.offsetTop;
                ref.current.scrollTo({
                  top: top,
                  behavior: "smooth",
                });
              }
            }, 400);
          }}
          parentScrollRef={scrollContainer}
          expand={expand}
          setExpand={setExpand}
          data={data}
          onShowDetail={onShowDetail}
          isLoadingMore={isValidating}
          hasNextPage={hasNextPage}
          isError={isError}
          getNext={() => {
            if (isValidating || !hasNextPage) return;
            setSize(size + 1);
          }}
        />
      </div>
    </div>
  );
};

export const NFTCollectionWidget = memo(RenderNFTCollectionWidget);
