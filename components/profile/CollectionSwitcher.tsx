import { memo } from "react";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderCollectionSwitcher = (props) => {
  const { collections, currentSelect, onSelect, scrollToEnd, hasNextPage } =
    props;
  const hideDropdownMenu = (v) => {
    onSelect(v.collection_id);
  };
  return (
    <div className="collection-switcher">
      <div id="collection-switcher-box" className="collection-list">
        {collections.map((item) => (
          <div
            id={`collection_${item.collection_id}`}
            onClick={() => hideDropdownMenu(item)}
            className={
              item.collection_id === currentSelect
                ? "collection-item active"
                : "collection-item"
            }
            title={item.name}
            key={item.collection_id}
          >
            <NFTAssetPlayer
              className="collection-img"
              src={item.image_url}
              height={52}
              width={52}
              placeholder={true}
              alt={item.name}
            />
            {item.assets.length > 1 && (
              <div className="collection-badge">+{item.assets.length}</div>
            )}
            
            <div className="collection-name text-assistive">NFT Collection: {item.name}</div>
          </div>
        ))}
        {hasNextPage && (
          <div
            id="collection_load_more"
            onClick={scrollToEnd}
            className="collection-item"
          >
            <NFTAssetPlayer
              className="collection-img collection-img-more"
              src={"/icons/icon-more.svg"}
              height={52}
              width={52}
              alt={"Load more NFTs"}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const CollectionSwitcher = memo(RenderCollectionSwitcher);
