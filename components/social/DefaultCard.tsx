import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { formatText, resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderDefaultCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  return (
    <>
      <div className="feed-content">
        {metadata?.body}
      </div>
      {metadata?.media?.length > 0 && (
        <div className={`feed-content${metadata.media.length > 1 ? " media-gallery" : ""}`}>
          {metadata.media.map((x) => (
            <NFTAssetPlayer
              className="feed-content-img"
              src={resolveMediaURL(x.address)}
              type={x.mime_type}
              key={x.address}
            />
          ))}
        </div>
      )}
      {metadata?.target && (
        <div className="feed-content">
          <Link
            className="feed-target"
            href={resolveIPFS_URL(metadata?.target_url) || ""}
            target="_blank"
          >
            <div className="feed-target-name">
              <strong>
                {formatText(metadata?.target?.handle)}
              </strong>
            </div>
            <div className="feed-target-content">
              {metadata?.target?.body}
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export const DefaultCard = memo(RenderDefaultCard);
