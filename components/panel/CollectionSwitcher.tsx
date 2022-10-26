import { memo } from "react";

const RenderCollectionSwitcher = (props) => {
  const {collections, currentSelect, onSelect} = props
  console.log(collections,'collec')
  return (
    <div className="collection-switcher">
      <img className="collection-img" src="img/collection.png" alt="" />
      <div className="collection-name">Collections</div>
      <div className="collection-switch-arrow">
        <img src="icons/switch.svg" alt="" />
      </div>
    </div>
  );
};

export const CollectionSwitcher = memo(RenderCollectionSwitcher);
