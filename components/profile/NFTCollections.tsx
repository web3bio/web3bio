import { memo, useEffect, useRef, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { resolveMediaURL } from "../../utils/utils";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { CollectionSwitcher } from "./CollectionSwitcher";

const RenderNFTCollections = (props) => {
  const {
    onShowDetail,
    data,
    expand,
    parentScrollRef,
    handleScrollToAsset,
    isLoadingMore,
    isReachingEnd,
    getNext,
    isError,
    setExpand,
  } = props;
  const [activeCollection, setActiveCollection] = useState(null);
  const insideScrollContainer = useRef(null);
  const [albumRef] = useInfiniteScroll({
    loading: isLoadingMore,
    disabled: !!isError,
    onLoadMore: getNext,
    hasNextPage: !isReachingEnd,
  });
  useEffect(() => {
    if (expand) {
      parentScrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });

      const judgeActiveCollection = () => {
        const nav_contentRect =
          insideScrollContainer.current.getBoundingClientRect();
        const groupList = Array.from(
          data.map((x) => document.getElementById(x.collection_id))
        );
        if (nav_contentRect) {
          groupList.map((item: any) => {
            if (!item) return;
            const itemReact = item.getBoundingClientRect();
            if (itemReact.y <= 250 && itemReact.y + itemReact.height > 250) {
              if (activeCollection !== item.collection_id) {
                setActiveCollection(item.collection_id);
              }
            }
          });
        }

        const swticherContainer = document.getElementById(
          "collection-switcher-box"
        );
        const activeElement = document.getElementById(
          `collection_${activeCollection}`
        );
        if (!swticherContainer || !activeElement) return;
        const activeIndex = data.findIndex(
          (x) => x.collection_id === activeCollection
        );
        swticherContainer.scrollTo({
          left: activeIndex * activeElement.getBoundingClientRect().width,
          behavior: "smooth",
        });
      };

      if (insideScrollContainer.current && data) {
        insideScrollContainer.current.addEventListener(
          "wheel",
          judgeActiveCollection,
          {
            passive: true,
          }
        );
      }
      return () =>
        insideScrollContainer.current?.removeEventListener(
          "wheel",
          judgeActiveCollection,
          {
            passive: true,
          }
        );
    }
  }, [expand, parentScrollRef, data, activeCollection]);
  const scrollToEnd = () => {
    if (insideScrollContainer.current) {
      insideScrollContainer.current.scrollTo({
        top: insideScrollContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  if (!data || !data.length) return <Empty />;

  return (
    <>
      {data && data.length > 0 && (
        <CollectionSwitcher
          collections={data}
          currentSelect={activeCollection ?? data[0].collection_id}
          onSelect={(v) => {
            setActiveCollection(v);
            handleScrollToAsset(insideScrollContainer, v);
          }}
          hasNextPage={!isReachingEnd}
          scrollToEnd={() => {
            if (!expand) {
              setExpand(true);
              setTimeout(() => {
                scrollToEnd();
              }, 400);
            } else {
              scrollToEnd();
            }
          }}
        />
      )}
      {expand && (
        <div ref={insideScrollContainer} className="nft-collection">
          <div className="nft-collection-list">
            {data.map((x, idx) => {
              if (!x.assets.length) return null;
              return (
                <div
                  className="nft-collection-item"
                  key={idx}
                  id={x.collection_id}
                >
                  <div className="collection-title">
                    <NFTAssetPlayer
                      type={"image/png"}
                      className="collection-logo"
                      src={x.image_url}
                      alt={x.name}
                    />
                    <div className="collection-name text-ellipsis">
                      {x.name}
                    </div>
                  </div>
                  <div className="nft-list">
                    {x.assets.map((y, ydx) => {
                      const mediaURL = resolveMediaURL(
                        y.previews.image_medium_url ||
                          y.video_url ||
                          y.image_url
                      );

                      const type =
                        y.video_url && !y.previews.image_medium_url
                          ? y.video_properties.mime_type
                          : "image/png";

                      return (
                        <div
                          key={ydx}
                          className="nft-container c-hand"
                          onClick={(e) =>
                            onShowDetail(e, {
                              collection: {
                                url: x.image_url,
                                name: x.name,
                              },
                              asset: y,
                              mediaURL: y.video_url || y.image_url,
                            })
                          }
                        >
                          <div className="nft-item">
                            <NFTAssetPlayer
                              className={"img-container"}
                              src={mediaURL}
                              type={type}
                              alt={x.name + " - " + y.name}
                              poster={y.previews.image_large_url}
                            />
                            <div className="collection-name">{x.name}</div>
                            <div className="nft-name">
                              {y.name || `${x.name} #${y.token_id}`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          {(isLoadingMore || !isReachingEnd) && (
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
      )}
    </>
  );
};

export const NFTCollections = memo(RenderNFTCollections);
