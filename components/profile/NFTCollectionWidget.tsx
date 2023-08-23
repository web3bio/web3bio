"use client";
import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";
import { _fetcher } from "../apis/ens";
import { SIMPLE_HASH_URL } from "../apis/simplehash";
import { NFT_PAGE_SIZE } from "../../utils/queries";

const CHAIN_PARAM = "ethereum";
const CURSOR_PARAM = "&cursor=";
export const MAX_SPAM_SCORE = encodeURIComponent("spam_score_lte=90");

export const processNFTsData = (data) => {
  if (!data?.length) return [];
  const uniqueValues = new Set();
  const assets = new Array();
  for (const obj of data) {
    const nfts = obj.nfts;
    if (!nfts) {
      continue;
    }

    for (const asset of nfts) {
      if (!uniqueValues.has(asset)) {
        uniqueValues.add(asset);
        assets.push(asset);
      }
    }
  }

  const collections = new Array();
  const collectionById = new Map();
  for (const asset of assets) {
    const { collection } = asset;
    // todo: old
    // if (!collection || collection.spam_score > 75) continue;
    // todo: check spam_score here
    if (collection.spam_score > 60)
      console.log("spam_core:", collection.spam_score);
    let collectionItem = collectionById.get(collection.collection_id);
    if (!collectionItem) {
      collectionItem = { ...collection, assets: [] };
      collectionById.set(collection.collection_id, collectionItem);
      collections.push(collectionItem);
    }

    collectionItem.assets.push(asset);
  }

  return collections;
};

const getURL = (index, address, previous) => {
  if (
    index !== 0 &&
    previous &&
    (!previous?.nfts.length || !previous?.next_cursor)
  )
    return null;
  const cursor = previous?.next_cursor || "";
  return (
    SIMPLE_HASH_URL +
    `/api/v0/nfts/owners_v2?chains=${CHAIN_PARAM}&wallet_addresses=${address}${
      cursor ? CURSOR_PARAM + cursor : ""
    }&limit=${NFT_PAGE_SIZE}&filters=${MAX_SPAM_SCORE}&order_by=transfer_time__desc`
  );
};

function useNFTs({ address, initialData, fromServer }) {
  const options = fromServer
    ? {
        initialSize: 1,
        fallbackData: [initialData],
      }
    : {};
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous),
    _fetcher,
    {
      ...options,
      suspense: !fromServer,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
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

const RenderNFTCollectionWidget = ({
  address,
  onShowDetail,
  initialData,
  fromServer,
}) => {
  const { data, size, setSize, isValidating, isError, hasNextPage } = useNFTs({
    address,
    initialData,
    fromServer,
  });
  const [expand, setExpand] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [[ref, assetId], setScrollRefAndAssetId] = useState<
    [{ current: HTMLElement | null }, string]
  >([{ current: null }, ""]);
  const scrollContainer = useRef(null);
  useEffect(() => {
    const scrollToAsset = (assetId) => {
      if (ref) {
        const anchorElement = document.getElementById(assetId);
        if (!anchorElement) return;
        const top = anchorElement.offsetTop;
        ref.current?.scrollTo({
          top,
          behavior: "smooth",
        });
      }
    };
    if (expand) {
      scrollToAsset(assetId);
    } else {
      if (!firstRender) {
        setExpand(true);
      }
      setTimeout(() => {
        scrollToAsset(assetId);
      }, 500);
    }
    setFirstRender(false);
  }, [assetId]);
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
          handleScrollToAsset={(ref, assetId) => {
            setScrollRefAndAssetId([ref, assetId]);
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
