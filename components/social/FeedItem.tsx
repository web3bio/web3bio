import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveIPFS_URL } from "../../utils/ipfs";
import SVG from "react-inlinesvg";
import { DefaultCard } from "./DefaultCard";
import { TransactionCard } from "./TransactionCard";
import { SocialCard } from "./SocialCard";
import { CollectibleCard } from "./CollectibleCard";
import { 
  NetworkMapping, 
  ActivityTypeMapping, 
  formatValue, 
  formatText, 
  isSameAddress, 
  SocialPlatformMapping 
} from "../../utils/utils";
import ActionExternalMenu from "./ActionExternalMenu";

export const RenderToken = (token) => {
  return (
    token && <div className="feed-token" key={token.name} title={token.name}>
      {token.image && (
        <Image
          className="feed-token-icon"
          src={token.image}
          alt={token.name}
          height={20}
          width={20}
          loading="lazy"
        />
      )}
      <span className="feed-token-value" title={formatValue(token)}>
        {formatText(formatValue(token))} 
      </span>
      <small className="feed-token-meta">{token.symbol}</small>
    </div>
  );
};

export const RenderIdentity = (identity) => {
  return (
    identity && <div className="feed-token">
      <span className="feed-token-value" title={identity}>
        {formatText(identity)}
      </span>
    </div>
  );
};

const RenderFeedContent = (props) => {
  const { action, tag } = props;
  switch (tag) {
    case ("social"):
      return <SocialCard action={action} />;
    case ("exchange"):
    case ("transaction"):
      return <TransactionCard action={action} />;
    case ("collectible"):
      return <CollectibleCard action={action} />;
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
          <div className="feed-item-action dropdown dropdown-right">
            <Link
              href={resolveIPFS_URL(action?.related_urls?.[0]) || ""}
              target="_blank"
              className="feed-timestamp hide-sm"
            >
              {new Date(feed.timestamp * 1000).toLocaleString()}
            </Link>
            <ActionExternalMenu links={action?.related_urls||[]} timestamp={feed.timestamp} />
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
