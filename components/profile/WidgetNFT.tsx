"use client";
import { memo, useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { ExpandController } from "./ExpandController";
import { NFTCollections } from "./NFTCollections";
import { SimplehashFetcher } from "../apis/simplehash";
import {
  SIMPLEHASH_URL,
  SIMPLEHASH_CHAINS,
  SIMPLEHASH_PAGE_SIZE,
} from "../apis/simplehash";
import NFTFilter from "./NFTFilter";
import { updateNFTWidget } from "../../state/widgets/action";
import { useDispatch } from "react-redux";

const CURSOR_PARAM = "&cursor=";

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

const getURL = (index, address, previous, filter) => {
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
    }&wallet_addresses=${address}&filters=spam_score__lte%3D1${
      cursor ? CURSOR_PARAM + cursor : ""
    }&limit=${SIMPLEHASH_PAGE_SIZE}`
  );
};

function useNFTs({ address, initialData, fromServer, filter }) {
  const options =
    fromServer && !filter
      ? {
          initialSize: 1,
          fallbackData: [initialData],
        }
      : {};
  const { data, error, size, isValidating, setSize } = useSWRInfinite(
    (index, previous) => getURL(index, address, previous, filter),
    SimplehashFetcher,
    {
      ...options,
      suspense: !fromServer,
      revalidateOnFocus: false,
      revalidateOnMount: false,
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

const RenderWidgetNFT = ({
  address,
  onShowDetail,
  initialData,
  fromServer,
}) => {
  const [expand, setExpand] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [filter, setFilter] = useState("");
  const { data, size, setSize, isValidating, isError, hasNextPage } = useNFTs({
    address,
    initialData,
    fromServer,
    filter,
  });
  const dispatch = useDispatch();
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
      // firstRender to fix collection click scrollTo
      if (!firstRender) {
        setExpand(true);
      }
      setTimeout(() => {
        scrollToAsset(assetId);
      }, 550);
      setFirstRender(false);
    }
    if (!isValidating) {
      dispatch(updateNFTWidget({ isEmpty: !data?.length }));
    }
  }, [assetId]);

  if (!filter && (!data.length || isError)) return null;

  // if (process.env.NODE_ENV !== "production") {
  //   console.log("NFT Data:", data);
  // }

  return (
    <div ref={scrollContainer} className="profile-widget-full" id="nft">
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
          onShowDetail={onShowDetail}
          isLoadingMore={isValidating}
          hasNextPage={hasNextPage}
          isError={isError}
          getNext={() => {
            if (isValidating || !hasNextPage) return;
            setSize(size + 1);
          }}
        />

        {expand && (
          <div className="profile-widget-footer">
            Powered by <strong>SimpleHash</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export const WidgetNFT = memo(RenderWidgetNFT);
