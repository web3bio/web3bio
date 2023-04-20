import { memo } from "react";
import { NFTCollections } from "./NFTCollections";

const RenderNFTPanel = (props) => {
  const { address, network, onShowDetail } = props;

  return (
    <>
      <NFTCollections
        address={address}
        onShowDetail={(e, a) => {
          e.stopPropagation();
          e.preventDefault();
          onShowDetail(a);
        }}
        isDetail
        network={network}
      />
    </>
  );
};

export const NFTPanel = memo(RenderNFTPanel);
