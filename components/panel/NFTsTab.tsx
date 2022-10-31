import { memo, useState } from "react";
import { NFTCollections } from "./NFTCollections";
import { NFTDialog } from "./NFTDialog";

const RenderNFTsTab = (props) => {
  const { address } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [asset, setAsset] = useState("");
  return (
    <div>
      <NFTCollections
        onShowDetail={(a) => {
          setAsset(a);
          setDialogOpen(true);
        }}
        isDetail
      />
      <NFTDialog
        asset={asset}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
