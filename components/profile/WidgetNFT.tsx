"use client";
import { useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";

import NFTFilter from "./NFTFilter";
import { useDispatch } from "react-redux";
import { PlatformType } from "../utils/platform";

import { WidgetType } from "../utils/widgets";
import { updateNFTWidget } from "../state/widgets/reducer";
import {
  SIMPLEHASH_CHAINS,
  SIMPLEHASH_PAGE_SIZE,
  SIMPLEHASH_URL,
  SimplehashFetcher,
} from "../utils/api";
import { Network } from "../utils/network";

const CURSOR_PARAM = "&cursor=";

const processNFTsData = (data) => {
  if (data?.[0] === null) return null;
  if (!data?.length) return [];
  const uniqueValues = new Set();
  const assets = new Array();
  for (const obj of data) {
    const nfts = obj?.nfts;
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
    if (!collection || collection.spam_score === null) continue;

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

const getURL = (index, address, previous, filter, network) => {
  if (
    index !== 0 &&
    previous &&
    (!previous?.nfts.length || !previous?.next_cursor)
  )
    return null;
  const cursor = previous?.next_cursor || "";

  return (
    SIMPLEHASH_URL +
    `/api/v0/nfts/owners_v2?chains=${
      filter || SIMPLEHASH_CHAINS
    }&wallet_addresses=${address}&filters=spam_score__lte%3D${
      network === Network.solana ? "99" : "1"
    }${cursor ? CURSOR_PARAM + cursor : ""}&limit=${SIMPLEHASH_PAGE_SIZE}`
  );
};

function useNFTs({ address, filter, network }) {
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous, filter, network),
    SimplehashFetcher,
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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

export default function WidgetNFT({ profile, openModal }) {
  const [expand, setExpand] = useState(
    !!(profile?.platform === PlatformType.solana)
  );
  const [filter, setFilter] = useState("");
  const { data, size, setSize, isValidating, isError, hasNextPage } = useNFTs({
    address: profile?.address,
    filter,
    network: profile.platform,
  });
  const dispatch = useDispatch();
  const [[ref, assetId], setScrollRefAndAssetId] = useState<
    [{ current: HTMLElement | null }, string]
  >([{ current: null }, ""]);

  const scrollContainer = useRef(null);

  useEffect(() => {
    if (
      window.location.hash &&
      window.location.hash === `#${WidgetType.nft}` &&
      !expand
    ) {
      setExpand(true);
    }
    const scrollToAsset = (assetId) => {
      if (!expand) setExpand(true);
      setTimeout(
        () => {
          if (ref) {
            const anchorElement = document.getElementById(assetId);
            if (!anchorElement) return;
            const top = anchorElement.offsetTop;
            ref.current?.scrollTo({
              top,
              behavior: "smooth",
            });
          }
          setScrollRefAndAssetId([ref, ""]);
        },
        expand ? 100 : 550
      );
    };
    if (assetId) {
      scrollToAsset(assetId);
    }
    if (!isValidating && data !== null) {
      dispatch(updateNFTWidget({ isEmpty: !data?.length, initLoading: false }));
    }
  }, [assetId, isValidating]);

  if (!filter && (!data?.length || isError)) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("NFT Data:", data);
  // }

  return (
    <div
      ref={scrollContainer}
      className="profile-widget-full"
      id={WidgetType.nft}
    >
      <div
        className={`profile-widget profile-widget-nft${
          expand ? " active" : ""
        }`}
      >
        <div className="profile-widget-header">
          <h2 className="profile-widget-title">
            <span className="emoji-large mr-2">🖼 </span>
            NFT Collections
          </h2>
          <div className="widget-action">
            <NFTFilter
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setExpand(true);
              }}
            />
            <ExpandController
              expand={expand}
              onToggle={() => {
                setExpand(!expand);
              }}
            />
          </div>
        </div>

        <NFTCollections
          handleScrollToAsset={(ref, newVal) => {
            setScrollRefAndAssetId([ref, newVal]);
          }}
          parentScrollRef={scrollContainer}
          expand={expand}
          setExpand={setExpand}
          data={data}
          openModal={(e, v) => openModal(v)}
          isLoadingMore={isValidating}
          hasNextPage={hasNextPage}
          isError={isError}
          getNext={() => {
            if (isValidating || !hasNextPage) return;
            setSize(size + 1);
          }}
        />

        {expand && (
          <div className="profile-widget-about">
            Powered by <strong>SimpleHash</strong>
          </div>
        )}
      </div>
    </div>
  );
}
