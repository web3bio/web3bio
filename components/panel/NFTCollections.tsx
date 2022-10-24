import { memo } from "react";
import { CollectionSwitcher } from "./CollectionSwitcher";

const RenderNFTCollections = (props) => {
  const { list = [1] } = props;
  return (
    <div className="nft-collection-container">
      <div className="nft-collection-title">NFT COLLECTION</div>
      <CollectionSwitcher />
      <div className="nft-list">
        {list.map((x, idx) => {
          return (
            <div key={idx} className="collection-nft-item">
              <img
                src="https://img.seadn.io/files/4148fc4a3513f9297087bb7d5816d69e.png?fit=max&w=1000"
                alt=""
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const NFTCollections = memo(RenderNFTCollections);
