import { memo, useState } from "react";
import { NFTCollections } from "./NFTCollections";
import { NFTDialog } from "./NFTDialog";

const RenderNFTsTab = (props) => {
  const { identity } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [asset, setAsset] = useState("");
  return (
    <div>
      <NFTCollections
        identity={identity}
        onShowDetail={(a) => {
          setAsset(a);
          setDialogOpen(true);
        }}
        isDetail
      />
      {dialogOpen && (
        <NFTDialog
          asset={asset}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </div>
  );
};

export const NFTsTab = memo(RenderNFTsTab);
