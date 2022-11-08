import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";
export function isTokenSwapFeed(feed) {
  return feed.tag === Tag.Exchange && feed.type === Type.Swap;
}

const RenderTokenSwapCard = (props) => {
  const { feed } = props;
  return <div>swap</div>;
};

export const TokenSwapCard = memo(RenderTokenSwapCard);
