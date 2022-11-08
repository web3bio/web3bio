import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";

export function isVoteFeed(feed) {
    return feed.tag === Tag.Governance && feed.type === Type.Vote
}

const RenderVoteFeed = ()=>{
    return <div>
        vote
    </div>
}

export const VoteCard = memo(RenderVoteFeed)