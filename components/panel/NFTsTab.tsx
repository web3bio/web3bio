import { memo } from "react";
import { NFTCollections } from "./NFTCollections";

const RenderNFTsTab = (props) => {
  const {address} = props
  return (
    <div>
      <NFTCollections isDetail />
    </div>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
