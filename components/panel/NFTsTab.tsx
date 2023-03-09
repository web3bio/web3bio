import { memo, useState } from "react";
import { NFTCollections } from "./components/NFTCollections";
import { NFTDialog } from "./components/NFTDialog";

const RenderNFTsTab = (props) => {
  const {
    identity,
    onShowDetail,
    dialogOpen,
    showDialog,
    closeDialog,
    network,
    collections
  } = props;
  const [asset, setAsset] = useState(null);

  return (
    <>
      <NFTCollections
      collections={collections}
        identity={identity}
        onShowDetail={(a) => {
          setAsset(a);
          onShowDetail(a);
          showDialog();
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
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
