import { memo } from "react";
import { NFTCollections } from "./NFTCollections";

const RenderNFTsTab = () => {
  return (
    <div>
      <NFTCollections isDetail />
    </div>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
