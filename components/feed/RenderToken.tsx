import { resolveIPFS_URL } from "../utils/ipfs";
import { formatText, formatValue } from "../utils/utils";
import Image from "next/image";
export const RenderToken = (props) => {
  const { key, name, symbol, image, value, standard } = props;
  return [721, 1155].includes(standard)?  <div>nft</div>  :  (
    <div
      className="feed-token"
      key={key}
      title={formatValue(value) + " " + symbol}
    >
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
