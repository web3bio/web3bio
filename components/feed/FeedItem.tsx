import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveIPFS_URL } from "../../utils/ipfs";
import SVG from "react-inlinesvg";
import { DefaultCard } from "./DefaultFeed";
import { TransactionCard } from "./TransactionFeed";
import { SocialCard } from "./SocialFeed";
import { CollectibleCard } from "./CollectibleFeed";
import {
  NetworkMapping,
  ActivityTypeMapping,
  formatValue,
  formatText,
  isSameAddress,
  SocialPlatformMapping,
} from "../../utils/utils";
import ActionExternalMenu from "./ActionExternalMenu";

export const RenderToken = (token, key) => {
  return (
    token && (
      <div className="feed-token" key={key} title={token.name}>
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
    )
  );
};

const RenderFeedContent = (props) => {
  const { action, tag, id, openModal, network } = props;
  switch (tag) {
    case "social":
      return <SocialCard openModal={openModal} action={action} />;
    case "exchange":
    case "transaction":
      return (
        <TransactionCard id={id} action={action} />
      );
    case "collectible":
      return (
        <CollectibleCard
          network={network}
          openModal={openModal}
          action={action}
        />
      );
    default:
      return <DefaultCard action={action} />;
  }
};

const RenderFeedItem = (props) => {
  const { feed, identity, openModal } = props;
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
              style={{ backgroundColor: NetworkMapping(networkName).bgColor }}
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
              style={{ backgroundColor: NetworkMapping(platformName).bgColor }}
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
            <ActionExternalMenu
              links={action?.related_urls || []}
              timestamp={feed.timestamp}
            />
          </div>
        </div>
        <div className="feed-item-body">
          {feed.tag === "social" ? (
            <RenderFeedContent
              network={feed.network}
              openModal={openModal}
              action={action}
              tag={action.tag}
              id={action.id}
            />
          ) : (
            actions.map((x, index) => (
              x.tag !== "unknown" && <RenderFeedContent
                network={feed.network}
                openModal={openModal}
                action={x}
                tag={x.tag}
                id={x.id}
                key={index}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
