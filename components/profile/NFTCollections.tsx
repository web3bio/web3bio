import { memo, useEffect, useRef, useState } from "react";
import { resolveMediaURL } from "../../utils/utils";
import { Empty } from "../shared/Empty";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { CollectionSwitcher } from "./CollectionSwitcher";

const RenderNFTCollections = (props) => {
  const { onShowDetail, data, expand, parentScrollRef, handleScrollToAsset } =
    props;
  const [activeCollection, setActiveCollection] = useState(null);
  const insideScrollContainer = useRef(null);

  useEffect(() => {
    if (expand) {
      parentScrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });

      const judgeActiveCollection = () => {
        const nav_contentRect =
          insideScrollContainer.current.getBoundingClientRect();
        const groupList = Array.from(
          data.map((x) => document.getElementById(x.id))
        );
        if (nav_contentRect) {
          groupList.map((item: any) => {
            if (!item) return;
            const itemReact = item.getBoundingClientRect();
            if (itemReact.y <= 250 && itemReact.y + itemReact.height > 250) {
              if (activeCollection !== item.id) {
                setActiveCollection(item.id);
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
        const activeIndex = data.findIndex((x) => x.id === activeCollection);
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

  if (!data) return <Empty />;
  return (
    <>
      {data && data.length > 0 && (
        <CollectionSwitcher
          collections={data.filter((x) => x.assets.length > 0)}
          currentSelect={activeCollection ?? data[0].id}
          onSelect={(v) => {
            setActiveCollection(v);
            handleScrollToAsset(insideScrollContainer, v);
          }}
        />
      )}
      {expand && (
        <div ref={insideScrollContainer} className="nft-collection">
          <div className="nft-collection-list">
            {data.map((x, idx) => {
              if (!x.assets.length) return null;
              return (
                <div className="nft-collection-item" key={idx} id={x.id}>
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
                        y.video_url || y.image_url
                      );
                      const contentURL = resolveMediaURL(
                        y.video_url || y.audio_url
                      );
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
                              mediaURL: mediaURL,
                              contentURL: contentURL,
                            })
                          }
                        >
                          <div className="nft-item">
                            <NFTAssetPlayer
                              className={"img-container"}
                              type={y.video_url ? "video/mp4" : "image/png"}
                              src={mediaURL}
                              contentUrl={contentURL}
                              alt={x.name + " - " + y.name}
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
        </div>
      )}
    </>
  );
};

export const NFTCollections = memo(RenderNFTCollections);
