import { memo } from "react";
import {
  CollectibleCard,
  isCollectibleFeed,
} from "./feedCards/CollectibleCard";
import { CommentCard, isCommentFeed } from "./feedCards/CommentCard";
import { DonationCard, isDonationFeed } from "./feedCards/DonationCard";
import { isNoteFeed, NoteCard } from "./feedCards/NoteCard";
import { isProfileFeed, ProfileCard } from "./feedCards/ProfileCard";
import {
  isTokenTransferFeed as isTokenOperationFeed,
  TokenOperationCard,
} from "./feedCards/TokenOperationCard";
import { isTokenSwapFeed, TokenSwapCard } from "./feedCards/TokenSwapCard";

export const isSupportedFeed = (feed) => {
  return (
    isTokenOperationFeed(feed) ||
    isTokenSwapFeed(feed) ||
    isCollectibleFeed(feed) ||
    isDonationFeed(feed) ||
    isNoteFeed(feed) ||
    isCommentFeed(feed) ||
    isProfileFeed(feed)
  );
};

const RenderFeedItem = (props) => {
  const { feed, identity } = props;
  if (isTokenOperationFeed(feed))
    return <TokenOperationCard feed={feed} identity={identity} />;
  if (isTokenSwapFeed(feed))
    return <TokenSwapCard feed={feed} identity={identity} />;

  if (isCollectibleFeed(feed))
    return <CollectibleCard feed={feed} identity={identity} />;

  if (isDonationFeed(feed)) return <DonationCard feed={feed} identity={identity} />;

  if (isNoteFeed(feed)) return <NoteCard feed={feed} identity={identity} />;

  if (isCommentFeed(feed))
    return <CommentCard feed={feed} identity={identity} />;

  if (isProfileFeed(feed))
    return <ProfileCard feed={feed} identity={identity} />;

  return null;
};


export const FeedItem = memo(RenderFeedItem);
