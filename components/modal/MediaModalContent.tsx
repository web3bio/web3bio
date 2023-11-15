import { resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

export default function MediaModalContent(props) {
  const { type, url, alt, onClose } = props;
  return (
    <div className="modal-preview-image-container" onClick={onClose}>
      <NFTAssetPlayer
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="modal-preview-image"
        src={resolveMediaURL(url)}
        type={type}
        alt={alt ?? "media"}
      />
    </div>
  );
}
