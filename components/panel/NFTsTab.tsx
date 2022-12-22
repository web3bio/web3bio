import { memo, useEffect, useState } from "react";
import { NFTCollections } from "./NFTCollections";
import { NFTDialog } from "./NFTDialog";

const RenderNFTsTab = (props) => {
  const { identity, onShowDetail } = props;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [asset, setAsset] = useState("");
  useEffect(() => {
    const clickEvent = (event) => {
      console.log(event,'kkkkk')
      event.preventDefault();
      event.stopPropagation();
      const dialog = document.getElementById("nft-dialog");
      if (dialogOpen && dialog && !dialog.contains(event.target)) {
        setDialogOpen(false);
      }
    };
    window.document.addEventListener("mousedown", clickEvent);
    return () => window.document.removeEventListener("mousedown", clickEvent);
  });
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
