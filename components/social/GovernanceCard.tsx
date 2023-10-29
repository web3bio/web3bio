import Link from "next/link";
import { memo } from "react";
import { formatText, formatValue, isSameAddress } from "../../utils/utils";
import { ActivityTag, ActivityType } from "../../utils/activity";
import { getLastAction } from "./CollectibleCard";
import SVG from "react-inlinesvg";

export function isGovernanceCard(feed) {
  return feed.tag === ActivityTag.governance && feed.type === ActivityType.vote;
}

const RenderGovernanceCard = (props) => {
  const { feed } = props;
  const action = getLastAction(feed);
  const metadata = action.metadata;

  return (
    <div className="feed-item-body">
      <div className="feed-content">
        <div className="feed-content-header">
          Voted for
          <strong>
            {metadata.proposal.options.join(",")}
            {formatValue(metadata?.token)} {metadata?.token?.symbol ?? ""}
          </strong>
          on
          <strong>{feed.platform}</strong>
        </div>

        {metadata && (
          <div className={"feed-content"}>
            <div className="feed-content-target">
              <div className="feed-target-name">
                <strong>{metadata.proposal.title}</strong>
              </div>
              <div className="feed-target-content">
                {metadata.proposal.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const GovernanceCard = memo(RenderGovernanceCard);
