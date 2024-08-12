import { memo, useMemo } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { FeedItem } from "../feed/FeedItem";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";

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
  } = props;
  const [albumRef] = useInfiniteScroll({
    loading: isLoadingMore,
    disabled: !!isError || !expand,
    onLoadMore: getNext,
    hasNextPage: hasNextPage,
  });

  const memoizedData = useMemo(
    () =>
      data
        ?.filter((x) => x?.actions?.some((action) => action))
        .map((x) => ({
          ...x,
          actions: x.actions.filter((action) => !!action),
        })),
    [data]
  );

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
        {memoizedData.map((x) => {
          return (
            <div key={x.id} className="feed-item">
              <FeedItem
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
