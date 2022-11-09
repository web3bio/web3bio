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
  const { feed, identity } = props;
  if (isTokenOperationFeed(feed))
    return <TokenOperationCard feed={feed} identity />;
  if (isTokenSwapFeed(feed)) return <TokenSwapCard feed={feed} identity />;

  if (isLiquidityFeed(feed)) return <LiquidityCard feed={feed}  />;

  if (isCollectibleFeed(feed)) return <CollectibleCard feed={feed}  />

  if (isDonationFeed(feed)) return <DonationCard feed={feed}  />

  if (isNoteFeed(feed)) return <NoteCard feed={feed} identity  />

  if (isCommentFeed(feed)) return <CommentCard feed={feed}  />

  if (isProfileFeed(feed)) return <ProfileCard feed={feed}  />

  if (isProposeFeed(feed)) return <ProposeCard feed={feed}  />

  if (isVoteFeed(feed)) return <VoteCard feed={feed}  />
};

export const FeedItem = memo(RenderFeedItem);
