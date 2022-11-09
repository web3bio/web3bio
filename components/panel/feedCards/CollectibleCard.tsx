import { memo } from "react";
import { Tag } from "../../apis/rss3/types";
export function isCollectibleFeed(feed) {
    return feed.tag === Tag.Collectible
}

const RenderCollectibleCard = (props)=>{
    return <div>collectible</div>
}

export const CollectibleCard = memo(RenderCollectibleCard)