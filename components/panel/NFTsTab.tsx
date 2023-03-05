import { memo, useState } from "react";
import { NFTCollections } from "./NFTCollections";
import { NFTDialog } from "./NFTDialog";

const RenderNFTsTab = (props) => {
  const {
    identity,
    onShowDetail,
    dialogOpen,
    showDialog,
    closeDialog,
    network,
  } = props;
  const [asset, setAsset] = useState("");

  return (
    <>
      <NFTCollections
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
          asset={asset}
          open={dialogOpen}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
