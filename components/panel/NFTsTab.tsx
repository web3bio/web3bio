import { memo, useState } from "react";
import { NFTCollections } from "./NFTCollections";
import { NFTDialog } from "./NFTDialog";

const RenderNFTsTab = (props) => {
  const { identity, onShowDetail, defaultOpen } = props;
  const [dialogOpen, setDialogOpen] = useState(defaultOpen);
  const [asset, setAsset] = useState("");
  return (
    <>
      <NFTCollections
        identity={identity}
        onShowDetail={(a) => {
          setAsset(a);
          onShowDetail(a);
          setDialogOpen(true);
        }}
        isDetail
      />
      {dialogOpen && asset && (
        <NFTDialog
          asset={asset}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
