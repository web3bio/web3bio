import { memo } from "react";
import Link from "next/link";
import { resolveIPFS_URL } from "../../utils/ipfs";
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
import {
  isTokenTransferFeed as isTokenOperationFeed,
  TokenOperationCard,
} from "./TokenOperationCard";
import { isTokenSwapFeed, TokenSwapCard } from "./TokenSwapCard";
import { ActivityTag, ActivityType, ActivityTypeMapping } from "../apis/rss3/types";
import { NetworkMapping } from "../../utils/network";
import ActionExternalMenu from "./ActionExternalMenu";

const RenderFeedContent = (props) => {
  const { feed, identity } = props;
  switch (!!feed) {
    case isTokenSwapFeed(feed):
      return <TokenSwapCard feed={feed} />;
    case isTokenOperationFeed(feed):
      return <TokenOperationCard feed={feed} identity={identity} />;
    case isCollectibleFeed(feed):
      return <CollectibleCard feed={feed} identity={identity} />;
    case isDonationFeed(feed):
      return <DonationCard feed={feed} />;
    
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
              className={`feed-icon-platform ${networkName} ${platformName}`}
              style={
                {backgroundColor: networkName
                  ? NetworkMapping(networkName).bgColor
                  : NetworkMapping(platformName).bgColor,
                }
              }
              title={NetworkMapping(platformName).label}
            >
              <SVG
                fill={
                  networkName
                    ? NetworkMapping(networkName).primaryColor
                    : SocialPlatformMapping(platformName).color
                }
                src={
                  (networkName
                    ? NetworkMapping(networkName).icon
                    : SocialPlatformMapping(platformName).icon) || ""
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
            <Link
              href={resolveIPFS_URL(action?.related_urls?.[0]) || ""}
              target="_blank"
              className="feed-timestamp"
            >
              {new Date(feed.timestamp * 1000).toLocaleString()}
            </Link>
            <ActionExternalMenu links={action?.related_urls || []} />
          </div>
        </div>
        <RenderFeedContent action={action} feed={feed} identity={identity} />
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
