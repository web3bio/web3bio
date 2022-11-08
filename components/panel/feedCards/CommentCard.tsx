import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";

export function isCommentFeed(feed) {
    return feed.tag === Tag.Social && feed.type === Type.Comment
}

const RenderCommentFeed = ()=>{
    return <div>
        comment
    </div>
}

export const CommentCard = memo(RenderCommentFeed)