import { memo } from "react";
import {
  CollectibleCard,
  isCollectibleFeed,
} from "./feedCards/CollectibleCard";
import { DonationCard, isDonationFeed } from "./feedCards/DonationCard";
import { isArticleCard, ArticleCard } from "./feedCards/ArticleCard";
import { isProfileFeed, ProfileCard } from "./feedCards/ProfileCard";
import {
  isTokenTransferFeed as isTokenOperationFeed,
  TokenOperationCard,
} from "./feedCards/TokenOperationCard";
import { isTokenSwapFeed, TokenSwapCard } from "./feedCards/TokenSwapCard";
import { CommentCard, isCommentFeed } from "./feedCards/CommentCard";
import { GovernanceCard, isGovernanceCard } from "./feedCards/GovernanceCard";

export const isSupportedFeed = (feed) => {
  return (
    isTokenOperationFeed(feed) ||
    isTokenSwapFeed(feed) ||
    isCollectibleFeed(feed) ||
    isDonationFeed(feed) ||
    isArticleCard(feed) ||
    isProfileFeed(feed) ||
    isCommentFeed(feed) ||
    isGovernanceCard(feed)
  );
};

const RenderFeedItem = (props) => {
  const { feed, identity, network } = props;
  if (isTokenOperationFeed(feed))
    return (
      <TokenOperationCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );
  if (isTokenSwapFeed(feed))
    return (
      <TokenSwapCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );

  if (isCollectibleFeed(feed))
    return (
      <CollectibleCard
        identity={identity}
        feed={feed}
        name={identity.displayName}
      />
    );

  if (isDonationFeed(feed))
    return (
      <DonationCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );
  if (isProfileFeed(feed))
    return (
      <ProfileCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );

  if (isArticleCard(feed))
    return (
      <ArticleCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );
  if (isCommentFeed(feed))
    return (
      <CommentCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );

  if (isGovernanceCard(feed))
    return (
      <GovernanceCard
        feed={feed}
        identity={identity}
        name={identity.displayName}
      />
    );

  return null;
};

export const FeedItem = memo(RenderFeedItem);
