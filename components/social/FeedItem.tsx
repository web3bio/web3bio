import { memo } from "react";
import { formatText, isSameAddress } from "../../utils/utils";
import { SocialPlatformMapping } from "../../utils/platform";
import SVG from "react-inlinesvg";
import {
  CollectibleCard,
  getLastAction,
  isCollectibleFeed,
} from "./feedCards/CollectibleCard";
import { DonationCard, isDonationFeed } from "./feedCards/DonationCard";
import { isPostCard, PostCard } from "./feedCards/PostCard";
import { isProfileFeed, ProfileCard } from "./feedCards/ProfileCard";
import {
  isTokenTransferFeed as isTokenOperationFeed,
  TokenOperationCard,
} from "./feedCards/TokenOperationCard";
import { isTokenSwapFeed, TokenSwapCard } from "./feedCards/TokenSwapCard";
import { isCommentFeed } from "./feedCards/CommentCard";
import { GovernanceCard, isGovernanceCard } from "./feedCards/GovernanceCard";
import { FeedEmojiMapByTag } from "../apis/rss3";
import { NetworkMapping } from "../../utils/network";
import ActionExternalMenu from "./feedCards/ActionExternalMenu";

export const isSupportedFeed = (feed) => {
  return (
    isTokenOperationFeed(feed) ||
    isTokenSwapFeed(feed) ||
    isCollectibleFeed(feed) ||
    isDonationFeed(feed) ||
    isPostCard(feed) ||
    isProfileFeed(feed) ||
    isCommentFeed(feed) ||
    isGovernanceCard(feed)
  );
};

const RenderFeedContent = (props) => {
  const { feed, identity } = props;
  switch (!!feed) {
    case isPostCard(feed) || isCommentFeed(feed):
      return <PostCard feed={feed} />;
    case isTokenSwapFeed(feed):
      return <TokenSwapCard feed={feed} />;
    case isTokenOperationFeed(feed):
      return <TokenOperationCard feed={feed} identity={identity} />;
    case isCollectibleFeed(feed):
      return <CollectibleCard feed={feed} identity={identity} />;
    case isDonationFeed(feed):
      return <DonationCard feed={feed} />;
    case isProfileFeed(feed):
      return (
        <ProfileCard
          feed={feed}
          address={identity.address}
          name={identity.displayName}
        />
      );
    // case isGovernanceCard(feed):
    //   return (
    //     <GovernanceCard feed={feed} address={identity.address} name={identity.displayName} />
    //   );

    default:
      return null;
  }
};

const RenderFeedItem = (props) => {
  const { feed, identity } = props;
  const isOwner = isSameAddress(feed.owner, identity.address);
  const platformName = feed.platform?.toLowerCase();
  const networkName = feed.network?.toLowerCase();
  const action = getLastAction(feed);

  return (
    <>
      <div className="feed-item-icon">
        <div className="feed-icon-emoji">
          {FeedEmojiMapByTag[feed.tag]}
          {(platformName || networkName) && (
            <div
              className={`feed-icon-platform ${platformName || networkName}`}
            >
              <SVG
                fill={
                  platformName
                    ? SocialPlatformMapping(platformName).color
                    : NetworkMapping(networkName).primaryColor
                }
                src={
                  (platformName
                    ? SocialPlatformMapping(platformName).icon
                    : NetworkMapping(networkName).icon) || ""
                }
              />
            </div>
          )}
        </div>
      </div>
      <div className="feed-item-content">
        <div className="feed-item-header">
          <div className="feed-item-name">
            <strong>
              {isOwner
                ? identity.displayName || formatText(identity.address)
                : formatText(feed.from)}
            </strong>
          </div>
          <div className="feed-item-action dropdown">
            <div className="feed-timestamp">
              {new Date(feed.timestamp * 1000).toLocaleString()}
            </div>
            <ActionExternalMenu links={action.related_urls || []} />
          </div>
        </div>
        <RenderFeedContent action={action} feed={feed} identity={identity} />
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
