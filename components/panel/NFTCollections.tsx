import Image from "next/image";
import { memo } from "react";
import { CollectionSwitcher } from "./CollectionSwitcher";

const RenderNFTCollections = (props) => {
  const {
    list = [1, 2, 3, 4, 5, 6],
    isDetail,
    detailList = [1, 2, 3, 4, 5],
  } = props;
  return (
    <div className="nft-collection-container">
      <div className="nft-collection-title">NFT COLLECTIONS</div>
      <CollectionSwitcher />
      {(isDetail && (
        <div className="nft-detail-list">
          {detailList.map((x, idx) => {
            return (
              <div key={idx} className="detail-item">
                <div className="img-container">
                  <img
                    src="https://img.seadn.io/files/04a1b99e1478e40ffbfe5a02f68ae02d.png?fit=max&w=1000"
                    alt=""
                  />
                </div>
                <div className="collection-name">BEANZ Official</div>
                <div className="nft-name">Bean #3270</div>
              </div>
            );
          })}
        </div>
      )) || (
        <div className="nft-list">
          {list.map((x, idx) => {
            return (
              <div key={idx} className="collection-nft-item">
                <img
                  src="https://img.seadn.io/files/4148fc4a3513f9297087bb7d5816d69e.png?fit=max&w=1000"
                  alt="nft-item"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const NFTCollections = memo(RenderNFTCollections);
