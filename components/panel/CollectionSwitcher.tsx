import Image from "next/image";
import { memo } from "react";

const RenderCollectionSwitcher = (props) => {
  const { collections, currentSelect, onSelect } = props;
  return (
    <div className="collection-switcher">
      <Image
        width={20}
        height={20}
        className="collection-img"
        src="/img/collection.png"
        alt=""
      />
      <div className="collection-name">Collections</div>
      <div className="collection-switch-arrow">
        <Image width={8} height={8} src="/icons/switch.svg" alt="" />
      </div>
    </div>
  );
};

export const CollectionSwitcher = memo(RenderCollectionSwitcher);
