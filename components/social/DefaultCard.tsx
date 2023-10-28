import Link from "next/link";
import { memo } from "react";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { formatText, resolveMediaURL } from "../../utils/utils";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { getLastAction } from "./CollectibleCard";

const RenderDefaultCard = (props) => {
  const { feed } = props;

  const action = getLastAction(feed)
  const metadata = action.metadata;
  const target = metadata?.target;

  return (
    <div className="feed-item-body">
      <div className="feed-content">
        {metadata.body}
      </div>
      {metadata.media?.length > 0 && (
        <div className={`feed-content${metadata.media.length > 1 ? " media-gallery" : ""}`}>
          {metadata.media.map((x) => (
            <NFTAssetPlayer
              className="feed-content-img"
              src={resolveMediaURL(x.address)}
              type={x.mime_type}
              alt={metadata.handle}
              key={x.address}
            />
          ))}
        </div>
      )}
      {target && (
        <div className="feed-content">
          <Link
            className="feed-target"
            href={resolveIPFS_URL(metadata?.target_url) || ""}
            target="_blank"
          >
            <div className="feed-target-name">
              <strong>
                {formatText(target?.handle)}
              </strong>
            </div>
            <div className="feed-target-content">
              {target?.body}
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export const DefaultCard = memo(RenderDefaultCard);
