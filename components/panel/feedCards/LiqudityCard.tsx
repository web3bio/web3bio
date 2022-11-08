import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";
export function isLiquidityFeed(feed) {
  return feed.tag === Tag.Exchange && feed.type === Type.Liquidity;
}

const RenderLiqudityCard = (props) => {
  return <div>liqudity</div>;
};

export const LiquidityCard = memo(RenderLiqudityCard);
