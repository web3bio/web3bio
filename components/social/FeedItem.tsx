import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveIPFS_URL } from "../../utils/ipfs";
import SVG from "react-inlinesvg";
import { DefaultCard } from "./DefaultCard";
import { TransactionCard } from "./TransactionCard";
import { GovernanceCard } from "./GovernanceCard";
import { ActivityTag, ActivityType  } from "../../utils/activity";
import { 
  NetworkMapping, 
  ActivityTypeMapping, 
  formatValue, 
  formatText, 
  isSameAddress, 
  SocialPlatformMapping 
} from "../../utils/utils";
import ActionExternalMenu from "./ActionExternalMenu";

export const RenderToken = (metadata) => {
  return (
    <div className="feed-token" title={metadata.name}>
      {metadata.image && (
        <Image
          className="feed-token-icon"
          src={metadata.image}
          alt={metadata.name}
          height={20}
          width={20}
          loading="lazy"
        />
      )}
      <span className="feed-token-value" title={formatValue(metadata)}>
        {formatText(formatValue(metadata))} 
      </span>
      <span className="feed-token-symbol">{metadata.symbol}</span>
    </div>
  );
};

const RenderFeedContent = (props) => {
  const { action, tag } = props;
  switch (tag) {
    case ("exchange"):
    case ("transaction"):
      return <TransactionCard action={action} />;
    case ("governance"):
      return <GovernanceCard action={action} />
    default:
      return <DefaultCard action={action} />;
  }
};

const RenderFeedItem = (props) => {
  const { feed, identity } = props;
  const isOwner = isSameAddress(feed.owner, identity.address);
  const platformName = feed.platform?.toLowerCase();
  const networkName = feed.network?.toLowerCase();
  const actions = feed.actions;
  const action = actions[0];

  return (
    <>
      <div className="feed-item-icon">
        <div className="feed-icon-emoji">
          {ActivityTypeMapping(feed.type).emoji}
          {networkName && platformName !== "lens" ? (
            <div
              className={`feed-icon-platform ${networkName}`}
              style={{backgroundColor: NetworkMapping(networkName).bgColor,}}
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
              style={{backgroundColor: NetworkMapping(platformName).bgColor,}}
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
          {feed.tag === "social" ? (
              <RenderFeedContent action={action} tag={feed.tag} />
          ) : (
            actions.map((x, index) => (
              <RenderFeedContent key={index} action={x} tag={x.tag} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
