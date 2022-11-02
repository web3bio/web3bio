import Image from "next/image";
import { memo } from "react";
import { Dropdown } from "../shared/Dropdown";

const RenderCollectionSwitcher = (props) => {
  const { collections, currentSelect, onSelect } = props;

  return (
    <div className="collection-switcher">
      {/* <Image
        width={20}
        height={20}
        className="collection-img"
        src="/img/collection.png"
        alt=""
      />
      <div className="collection-name">Collections</div>
      <div className="collection-switch-arrow">
        <Image width={8} height={8} src="/icons/switch.svg" alt="" />
      </div> */}

      <Dropdown items={collections} active={currentSelect} />
    </div>
  );
};

export const CollectionSwitcher = memo(RenderCollectionSwitcher);
