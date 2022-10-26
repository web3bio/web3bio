import { memo } from "react";
import { useNFTCollectionsByAddress } from "../apis/nftscan";
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
