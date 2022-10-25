import { memo } from "react";
import { useNFTCollectionsByAddress } from "../apis/nftscan";
import { NFTCollections } from "./NFTCollections";

const RenderNFTsTab = (props) => {
  const {address} = props
  const {data,error} = useNFTCollectionsByAddress(address)
  return (
    <div>
      <NFTCollections isDetail />
    </div>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
