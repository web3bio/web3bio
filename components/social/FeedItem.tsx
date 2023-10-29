import { memo } from "react";
import Link from "next/link";
import { resolveIPFS_URL } from "../../utils/ipfs";
import { formatText, isSameAddress, SocialPlatformMapping } from "../../utils/utils";
import SVG from "react-inlinesvg";
import { DefaultCard } from "./DefaultCard";
import { TransactionCard } from "./TransactionCard";
import { TokenSwapCard } from "./TokenSwapCard";
import { ActivityTag, ActivityType  } from "../../utils/activity";
import { NetworkMapping, ActivityTypeMapping } from "../../utils/utils";
import ActionExternalMenu from "./ActionExternalMenu";

const RenderFeedContent = (props) => {
  const { action, tag, type } = props;
  switch (tag) {
    case ("collectible"):
      return <TokenSwapCard action={action} />;
    case ("transaction"):
      return <TransactionCard action={action} />;
    default:
      return <DefaultCard action={action} />;
  }
};

export function getLastAction(actions) {
  return actions[actions.length - 1];
}

const RenderFeedItem = (props) => {
  const { feed, identity } = props;
  const isOwner = isSameAddress(feed.owner, identity.address);
  const platformName = feed.platform?.toLowerCase();
  const networkName = feed.network?.toLowerCase();
  const action = getLastAction(feed.actions);

  return (
    <>
      <div className="feed-item-icon">
        <div className="feed-icon-emoji">
          {ActivityTypeMapping(feed.type).emoji}
          {networkName && platformName !== "lens" ? (
            <div
              className={`feed-icon-platform ${networkName}`}
              style={{
                backgroundColor: NetworkMapping(networkName).bgColor,
              }}
              title={NetworkMapping(networkName).label}
            >
              <SVG
                fill={NetworkMapping(networkName).primaryColor}
                src={NetworkMapping(networkName).icon || ""}
              />
            </div>
          ) : (
            <div
              className={`feed-icon-platform ${platformName}`}
              style={{
                backgroundColor: NetworkMapping(platformName).bgColor,
              }}
              title={NetworkMapping(platformName).label}
            >
              <SVG
                fill={SocialPlatformMapping(platformName).color}
                src={SocialPlatformMapping(platformName).icon || ""}
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
        <div className="feed-item-body">
          { feed.tag === "social" ? (
              <RenderFeedContent action={action} tag={feed.tag} />
          ) : (
            feed.actions.map((x) => (
              <RenderFeedContent action={x} tag={x.tag} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
