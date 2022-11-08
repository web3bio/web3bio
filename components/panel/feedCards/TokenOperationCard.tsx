import { memo } from "react";
import { formatText } from "../../../utils/utils";
import { Tag, Type } from "../../apis/rss3/types";

export const isTokenTransferFeed = (feed) => {
  return (
    feed.tag === Tag.Transaction &&
    [Type.Transfer, Type.Burn].includes(feed.type)
  );
};

const RenderTokenOperationCard = (props) => {
  const { feed } = props;
  return (
    <div className="feed-item-box">
      <div className="feed-type-badge"></div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <div className="strong">{formatText(feed.address_from ?? "")}</div>
            sold an NFT to
            <div className="strong">{formatText(feed.address_to ?? "")}</div>
            for
            <div className="strong">0.02ETH</div>
          </div>
        </div>
        <div className="feed-item-main">
          <picture>
            <img
              className="feed-nft-img"
              src="https://gateway.ipfscdn.io/ipfs/Qmaib4bYVGxXzCLAprXFSktPH45BLr8kNGWJGHDbK925Rq/1369.webp"
              alt="nft"
            />
          </picture>
          <div className="feed-nft-info">
            <div className="nft-title">TurtleCase Gang #51</div>
            <div className="nft-collection-title">Your second face.</div>
          </div>
        </div>
        <div>7hrs</div>
      </div>
    </div>
  );
};

export const TokenOperationCard = memo(RenderTokenOperationCard);
