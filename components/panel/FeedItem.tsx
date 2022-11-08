import { memo } from "react";
import { CollectibleCard, isCollectibleFeed } from "./feedCards/CollectibleCard";
import { CommentCard, isCommentFeed } from "./feedCards/CommentCard";
import { DonationCard, isDonationFeed } from "./feedCards/DonationCard";
import { isLiquidityFeed,LiquidityCard  } from "./feedCards/LiqudityCard";
import { isNoteFeed, NoteCard } from "./feedCards/NoteCard";
import { isProfileFeed, ProfileCard } from "./feedCards/ProfileCard";
import { isProposeFeed, ProposeCard } from "./feedCards/ProposeCard";
import {
  isTokenTransferFeed as isTokenOperationFeed,
  TokenOperationCard,
} from "./feedCards/TokenOperationCard";
import { isTokenSwapFeed, TokenSwapCard } from "./feedCards/TokenSwapCard";
import { isVoteFeed, VoteCard } from "./feedCards/VoteCard";

const RenderFeedItem = (props) => {
  const { feed, ...rest } = props;
  if (isTokenOperationFeed(feed))
    return <TokenOperationCard feed={feed} {...rest} />;
  if (isTokenSwapFeed(feed)) return <TokenSwapCard feed={feed} {...rest} />;

  if (isLiquidityFeed(feed)) return <LiquidityCard feed={feed} {...rest} />;

  if (isCollectibleFeed(feed)) return <CollectibleCard feed={feed} {...rest} />

  if (isDonationFeed(feed)) return <DonationCard feed={feed} {...rest} />

  if (isNoteFeed(feed)) return <NoteCard feed={feed} {...rest} />

  if (isCommentFeed(feed)) return <CommentCard feed={feed} {...rest} />

  if (isProfileFeed(feed)) return <ProfileCard feed={feed} {...rest} />

  if (isProposeFeed(feed)) return <ProposeCard feed={feed} {...rest} />

  if (isVoteFeed(feed)) return <VoteCard feed={feed} {...rest} />
};

export const FeedItem = memo(RenderFeedItem);
