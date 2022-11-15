import { memo, useState } from "react";
import Image from "next/image";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderCollectionSwitcher = (props) => {
  const { collections, currentSelect, onSelect } = props;

  const [displayMenu, setDisplayMenu] = useState(false);
  const [active, setActive] = useState(currentSelect);

  const hideDropdownMenu = (v) => {
    setDisplayMenu(false);
    setActive(v);
    onSelect(v);
  };
  return (
    <div className="collection-switcher">
      <div
      // style={{ position: "fixed", inset: "0px" }}
      // onClick={() => setDisplayMenu(false)}
      ></div>
      <div className="dropdown-box">
        <div
          className="dropdown-button"
          onClick={() => setDisplayMenu(!displayMenu)}
        >
          <NFTAssetPlayer className="collection-img" src={active.url} />
          <div className="collection-name">{active.name}</div>
          <div className="collection-switch-arrow">
            <Image width={8} height={8} src="/icons/switch.svg" alt="" />
          </div>
        </div>
        {displayMenu && (
          <div className="dropdown-menu">
            {collections.map((item) => (
              <div
                onClick={() => hideDropdownMenu(item)}
                className={
                  item.key === active.key
                    ? "dropdown-button active"
                    : "dropdown-button"
                }
                key={item.key}
              >
                <NFTAssetPlayer className="collection-img" src={item.url} />
                <div className="collection-name">{item.name}</div>
                <div>{/* not see */}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CollectionSwitcher = memo(RenderCollectionSwitcher);
