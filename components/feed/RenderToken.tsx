import { ModalType } from "../hooks/useModal";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { resolveIPFS_URL } from "../utils/ipfs";
import { formatText, formatValue, resolveMediaURL } from "../utils/utils";
import Image from "next/image";
export const RenderToken = (props) => {
  const { name, symbol, image, value, standard, openModal, network, asset } =
    props;
  if (["ERC-721", "ERC-1155"].includes(standard) && asset.address) {
    return (
      <div
        className="feed-token c-hand"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openModal(ModalType.nft, {
            asset: {
              network: network,
              standard: standard,
              contractAddress: asset.address,
              tokenId: asset.id,
              asset: {
                ...asset,
              },
            },
          });
        }}
      >
        {asset.image_url && (
          <NFTAssetPlayer
            className="feed-token-icon"
            src={resolveMediaURL(asset.image_url)}
            type={"image/png"}
            width={20}
            height={20}
            alt={asset.title || asset.name}
          />
        )}
        <span className="feed-token-value">
          {asset.title || asset.name || asset?.contract?.name}
        </span>
        {asset.id && !asset.title && (
          <small className="feed-token-meta">{`#${formatText(
            asset.id
          )}`}</small>
        )}
      </div>
    );
  }
  return (
    <div className="feed-token" title={formatValue(value) + " " + symbol}>
      {image && (
        <Image
          className="feed-token-icon"
          src={resolveIPFS_URL(image) || ""}
          alt={name}
          height={20}
          width={20}
          loading="lazy"
        />
      )}
      <span className="feed-token-value">{formatText(formatValue(value))}</span>
      {symbol && <small className="feed-token-meta">{symbol}</small>}
    </div>
  );
};
