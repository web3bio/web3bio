import { memo } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { FeedItem, isSupportedFeed } from "../social/FeedItem";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";

const RenderSocialFeeds = (props) => {
  const {
    identity,
    data,
    network,
    isLoadingMore,
    getNext,
    hasNextPage,
    isError,
    expand,
  } = props;
  const [albumRef] = useInfiniteScroll({
    loading: isLoadingMore,
    disabled: !!isError || !expand,
    onLoadMore: getNext,
    hasNextPage: hasNextPage,
  });
  if (!data) return <Empty text="No Social Feeds" />;
  return (
    <div className="widget-feeds-container">
      <div className="feeds-list">
        {data.map((x) =>
          (isSupportedFeed(x) && (
            <div key={x.id} className={`feed-item ${x.network} ${x.tag} ${x.type}`}>
              <FeedItem network={network} identity={identity} feed={x} />
            </div>
          )) ||
          null
        )}
        {expand && (isLoadingMore || hasNextPage) && (
          <div
            ref={albumRef}
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              margin: "1.5rem 0",
              justifyContent: "center",
            }}
          >
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export const SocialFeeds = memo(RenderSocialFeeds);
