import { memo, use, useEffect, useMemo, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { FeedItem } from "../feed/FeedItem";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { ActivityTag, TagsFilterMapping } from "../utils/activity";
import { isSameAddress } from "../utils/utils";
import { SIMPLEHASH_URL, SimplehashFetcher } from "../utils/api";

const RenderActivityFeeds = (props) => {
  const {
    identity,
    data,
    network,
    isLoadingMore,
    getNext,
    hasNextPage,
    isError,
    expand,
    openModal,
    validTypes,
  } = props;

  const [nftInfos, setNftInfos] = useState(new Array());
  const [albumRef] = useInfiniteScroll({
    loading: isLoadingMore,
    disabled: !!isError || !expand,
    onLoadMore: getNext,
    hasNextPage: hasNextPage,
  });

  const memoizedData = useMemo(
    () =>
      data
        ?.filter((x) => x?.actions?.some((x) => !!x))
        .map((x) => ({
          ...x,
          actions: x.actions.filter((action) => {
            if (!action || !validTypes.includes(action.type)) return false;
            if (action.tag === ActivityTag.social) return true;
            return [action.from, action.to].some((i) =>
              isSameAddress(i, x.owner)
            );
          }),
        }))
        .filter((x) => x.actions?.length > 0),
    [data, validTypes]
  );
  const nftIds = useMemo(() => {
    if (
      ![
        TagsFilterMapping.collectibles.types,
        TagsFilterMapping.all.types,
      ].includes(validTypes)
    )
      return [];
    const uniqueIds = new Set();
    memoizedData.forEach((feed) => {
      feed.actions.forEach((action) => {
        const metadata = action.metadata;
        if (metadata) {
          const id = `${feed.network}.${metadata.address}.${metadata.id}`;
          uniqueIds.add(id);
        }
      });
    });

    return Array.from(uniqueIds) || [];
  }, [memoizedData, validTypes]);
  useEffect(() => {
    const batchFetchNFTs = async () => {
      const existingIds = new Set(
        nftInfos.map((info) => info.nft_id.toLowerCase())
      );
      const newIds = nftIds.filter(
        (id: string) => !existingIds.has(id.toLowerCase())
      );

      if (newIds.length === 0) return;
      try {
        const res = await SimplehashFetcher(
          `${SIMPLEHASH_URL}/api/v0/nfts/assets?nft_ids=${newIds.join(",")}`
        );
        if (res?.nfts) {
          setNftInfos((prevInfos) => [...prevInfos, ...res.nfts]);
        }
      } catch (error) {
        setNftInfos([]);
      }
    };
    if (nftIds?.length > 0) {
      batchFetchNFTs();
    }
  }, [nftIds]);

  if (!data?.length && isLoadingMore)
    return (
      <Loading
        styles={
          expand
            ? {
                width: "100%",
                display: "flex",
                height: "100vh",
                justifyContent: "center",
                padding: "2rem 0",
              }
            : {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }
        }
      />
    );
  if (!isLoadingMore && !data?.length)
    return <Empty title="No Activities" text="Please try different filter" />;

  return (
    <div className="widget-feeds-container">
      <div className="feeds-list">
        {memoizedData.map((x, idx) => {
          return (
            <div key={x.id} className="feed-item">
              <FeedItem
                nftInfos={nftInfos}
                openModal={openModal}
                network={network}
                identity={identity}
                feed={x}
                actions={x.actions.filter((x) => !!x)}
              />
            </div>
          );
        })}
      </div>

      {expand && (isLoadingMore || hasNextPage) && (
        <div
          ref={albumRef}
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            height: "6rem",
            justifyContent: "center",
            paddingTop: "2rem",
          }}
        >
          <Loading />
        </div>
      )}
    </div>
  );
};

export const ActivityFeeds = memo(RenderActivityFeeds);
