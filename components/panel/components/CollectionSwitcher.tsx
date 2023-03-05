import { memo } from "react";
import { NFTAssetPlayer } from "../../shared/NFTAssetPlayer";

const RenderCollectionSwitcher = (props) => {
  const { collections, currentSelect, onSelect } = props;
  const hideDropdownMenu = (v) => {
    onSelect(v.key);
  };

  return (
    <div className="collection-switcher">
      <div id="collection-switcher-box" className="collection-list">
        {collections.map((item) => (
          <div
            id={`collection_${item.key}`}
            onClick={() => hideDropdownMenu(item)}
            className={
              item.key === currentSelect
                ? "collection-item active"
                : "collection-item"
            }
            key={item.key}
          >
            <NFTAssetPlayer
              className="collection-img"
              src={item.url}
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
