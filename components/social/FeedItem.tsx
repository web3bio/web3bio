import { memo } from "react";
import { formatText, isSameAddress } from "../../utils/utils";
import { SocialPlatformMapping } from "../../utils/platform";
import SVG from "react-inlinesvg";
import {
  CollectibleCard,
  getLastAction,
  isCollectibleFeed,
} from "./CollectibleCard";
import { DonationCard, isDonationFeed } from "./DonationCard";
import { DefaultCard } from "./DefaultCard";
import { PostCard } from "./PostCard";
import {
  isTokenTransferFeed as isTokenOperationFeed,
  TokenOperationCard,
} from "./TokenOperationCard";
import { isTokenSwapFeed, TokenSwapCard } from "./TokenSwapCard";
import { FeedEmojiMapByType } from "../apis/rss3";
import { ActivityTag, ActivityType, ActivityTypeMapping } from "../apis/rss3/types";
import { NetworkMapping } from "../../utils/network";
import ActionExternalMenu from "./ActionExternalMenu";

const RenderFeedContent = (props) => {
  const { feed, identity } = props;
  switch (!!feed) {
    case ([ActivityType.post, ActivityType.comment].includes(feed.type)):
      return <PostCard feed={feed} />;
    
    // case isGovernanceCard(feed):
    //   return (
    //     <GovernanceCard feed={feed} address={identity.address} name={identity.displayName} />
    //   );

    default:
      return <DefaultCard feed={feed} />;
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
          {ActivityTypeMapping(feed.type).emoji}
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
            <ActionExternalMenu links={action?.related_urls || []} />
          </div>
        </div>
        <RenderFeedContent action={action} feed={feed} identity={identity} />
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
