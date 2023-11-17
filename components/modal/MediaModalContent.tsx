import { resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import Link from "next/link";
import SVG from "react-inlinesvg";
export default function MediaModalContent(props) {
  const { type, url, alt, onClose } = props;
  return (
    <div className="modal-preview-container" onClick={onClose}>
      <div className="preview-image-container">
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
        <Link
          href={resolveMediaURL(url)}
          target={"_blank"}
          className="btn external-icon"
        >
          <SVG src={"/icons/icon-open.svg"} width="20" height="20" />
        </Link>
      </div>
    </div>
  );
}
