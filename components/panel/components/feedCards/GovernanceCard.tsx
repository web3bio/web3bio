import Link from "next/link";
import { memo } from "react";
import {
  formatText,
  formatValue,
  isSameAddress,
} from "../../../../utils/utils";
import { Tag, Type } from "../../../apis/rss3/types";
import { getLastAction } from "./CollectibleCard";
import SVG from "react-inlinesvg";

export function isGovernanceCard(feed) {
  return feed.tag === Tag.Governance && feed.type === Type.Vote;
}

const RenderGovernanceCard = (props) => {
  const { feed, identity, name } = props;
  const action = getLastAction(feed);
  const metadata = action.metadata;
  const owner = identity.address;
  const isOwner = isSameAddress(feed.owner, owner);

  return (
    <div className="feed-item-box">
      <div className="feed-badge-emoji">🏛️</div>
      <div className="feed-item">
        <div className="feed-item-header">
          <div className="feed-type-intro">
            <strong>
              {isOwner ? name || formatText(owner) : formatText(owner ?? "")}
            </strong>
            voted for
            <strong>
              {metadata.proposal.options.join(",")}
              {formatValue(metadata?.token)} {metadata?.token?.symbol ?? ""}
            </strong>
            on
            <strong>{feed.platform}</strong>
          </div>
          <Link
            href={action?.related_urls?.[0] || ""}
            target="_blank"
            className="action-icon"
          >
            <SVG src="../icons/icon-open.svg" width={20} height={20} />
          </Link>
        </div>

        {metadata && (
          <div className={"feed-item-main"}>
            <div className="feed-nft-info">
              <div className="nft-title">{metadata.proposal.title}</div>
              <div className="nft-subtitle">{metadata.proposal.body}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const GovernanceCard = memo(RenderGovernanceCard);
