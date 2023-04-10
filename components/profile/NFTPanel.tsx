import { memo, useState } from "react";
import { NFTCollections } from "../panel/components/NFTCollections";
import { NFTDialog } from "../panel/components/NFTDialog";
import { PlatformType } from "../../utils/platform";

const RenderNFTPanel = (props) => {
  const { address, dialogOpen, showDialog, closeDialog, network, collections } =
    props;
  const [asset, setAsset] = useState(null);

  return (
    <>
      <NFTCollections
        address={address}
        onShowDetail={(a) => {
          setAsset(a);
          showDialog();
        }}
        isDetail
        // initialData={collections}
        network={network}
      />
      {dialogOpen && asset && (
        <NFTDialog
          network={network}
          address={asset.asset.contract_address}
          tokenId={asset.asset.token_id}
          asset={asset}
          open={dialogOpen}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export const NFTPanel = memo(RenderNFTPanel);
