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
import { PlatformType } from "../../../utils/platform";

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
  const { feed, identity, network } = props;
  if (isTokenOperationFeed(feed))
    return (
      <TokenOperationCard
        feed={feed}
        owner={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
        name={
          network === PlatformType.lens
            ? identity.displayName
            : identity.name || identity.handle
        }
      />
    );
  if (isTokenSwapFeed(feed))
    return (
      <TokenSwapCard
        feed={feed}
        owner={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
        name={
          network === PlatformType.lens
            ? identity.displayName
            : identity.name || identity.handle
        }
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
        owner={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
        name={
          network === PlatformType.lens
            ? identity.displayName
            : identity.name || identity.handle
        }
      />
    );

  if (isNoteFeed(feed))
    return (
      <NoteCard
        feed={feed}
        owner={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
        name={
          network === PlatformType.lens
            ? identity.displayName
            : identity.name || identity.handle
        }
      />
    );

  if (isCommentFeed(feed))
    return (
      <CommentCard
        feed={feed}
        owner={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
        name={
          network === PlatformType.lens
            ? identity.displayName
            : identity.name || identity.handle
        }
      />
    );

  if (isProfileFeed(feed))
    return (
      <ProfileCard
        feed={feed}
        owner={
          network === PlatformType.lens ? identity.ownedBy : identity.identity
        }
        name={
          network === PlatformType.lens
            ? identity.displayName
            : identity.name || identity.handle
        }
      />
    );

  return null;
};

export const FeedItem = memo(RenderFeedItem);
