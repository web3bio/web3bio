import { memo, useEffect, useState } from "react";
import { NFTCollections } from "./NFTCollections";
import { NFTDialog } from "./NFTDialog";

const RenderNFTsTab = (props) => {
  const { identity, onShowDetail, dialogOpen, showDialog, closeDialog } = props;
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
      />
      {dialogOpen && asset && (
        <NFTDialog
          asset={asset}
          open={dialogOpen}
          onClose={closeDialog}
        />
      )}
    </>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
