import { memo, useState } from "react";
import { NFTCollections } from "../panel/components/NFTCollections";
import { NFTDialog } from "../panel/components/NFTDialog";

const RenderNFTPanel = (props) => {
  const { address, network } = props;
  const [asset, setAsset] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <NFTCollections
        address={address}
        onShowDetail={(e, a) => {
          e.stopPropagation();
          e.preventDefault();
          setAsset(a);
          setDialogOpen(true);
        }}
        isDetail
        network={network}
      />
      {dialogOpen && asset && (
        <NFTDialog
          network={network}
          address={asset.asset.contract_address}
          tokenId={asset.asset.token_id}
          asset={asset}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};

export const NFTPanel = memo(RenderNFTPanel);
