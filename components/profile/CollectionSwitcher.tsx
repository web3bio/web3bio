import { memo } from "react";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderCollectionSwitcher = (props) => {
  const { collections, currentSelect, onSelect } = props;
  const hideDropdownMenu = (v) => {
    onSelect(v.id);
  };

  return (
    <div className="collection-switcher">
      <div id="collection-switcher-box" className="collection-list">
        {collections.map((item) => (
          <div
            id={`collection_${item.id}`}
            onClick={() => hideDropdownMenu(item)}
            className={
              item.id === currentSelect
                ? "collection-item active"
                : "collection-item"
            }
            key={item.id}
          >
            <NFTAssetPlayer
              className="collection-img"
              src={item.image_url}
              height={52}
              width={52}
              alt={item.name}
            />
            <div className="collection-name text-assistive">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CollectionSwitcher = memo(RenderCollectionSwitcher);
