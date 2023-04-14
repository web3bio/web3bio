import { memo, useState } from "react";
import { NFTCollections } from "./components/NFTCollections";
import { NFTDialog } from "./components/NFTDialog";
import { PlatformType } from "../../utils/platform";

const RenderNFTsTab = (props) => {
  const {
    identity,
    dialogOpen,
    showDialog,
    closeDialog,
    network,
    collections,
  } = props;
  const [asset, setAsset] = useState(null);

  return (
    <>
      <NFTCollections
        address={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
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

export const NFTsTab = memo(RenderNFTsTab);
