import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";

export function isProposeFeed(feed) {
  return feed.tag === Tag.Governance && feed.type === Type.Propose;
}

const RenderProposeCard = (props) => {
  return <div>propose</div>;
};

export const ProposeCard = memo(RenderProposeCard);
