import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";

export function isProfileFeed(feed) {
    return feed.tag === Tag.Social && feed.type === Type.Profile
}

const RenderProfileFeed = ()=>{
    return <div>
        profile
    </div>
}

export const ProfileCard = memo(RenderProfileFeed)