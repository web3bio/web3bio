import { memo } from "react";
import { Tag, Type } from "../../apis/rss3/types";

export function isNoteFeed(feed) {
    return feed.tag === Tag.Social && [Type.Post, Type.Revise].includes(feed.type)
}

const RenderNoteCard = (props)=>{
    return <div>
        note
    </div>
}

export const NoteCard = memo(RenderNoteCard)