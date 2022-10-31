import { memo } from "react";
import SVG from "react-inlinesvg";
import { IconButton } from "../shared/IconButton";

const NFTDialogRender = (props) => {
  const { open, onClose, asset } = props;
  return (
    open && (
      <div className="panel-container">
        <div className="close-icon-box" onClick={onClose}>
          <SVG className="close-icon" src="icons/icon-close.svg" />
        </div>

        <div className="nft-dialog-basic">
          <img className="nft-dialog-asset-player" src={asset.image_uri} />
          <div className="nft-dialog-info">
            <div className="nft-dialog-collection">
              <img className="avatar" src={asset.collection.url} alt="" />
              <div className="title">{asset.collection.name}</div>
            </div>
            <div className="nft-name">{asset.asset.name}</div>
            <IconButton url={"/icons/social-opensea.svg"} />
          </div>
        </div>
      </div>
    )
  );
};

export const NFTDialog = memo(NFTDialogRender);
