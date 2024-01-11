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
import { ActivityType } from "../../utils/activity";

export const RenderToken = ({ key, name, symbol, image, value }) => {
  return (
    <div className="feed-token" key={key} title={name}>
      {image && (
        <Image
          className="feed-token-icon"
          src={resolveIPFS_URL(image) || ""}
          alt={name}
          height={20}
          width={20}
          loading="lazy"
        />
      )}
      <span className="feed-token-value" title={formatValue(name)}>
        {formatText(formatValue(value))}
      </span>
      <small className="feed-token-meta">{symbol}</small>
    </div>
  );
};

const resolveDuplicatedActions = (
  actions,
  id,
  specificTypes,
  isMetadataAction?
) => {
  const _data = JSON.parse(JSON.stringify(actions));
  const duplicatedObjects = new Array();
  _data.forEach((x, idx) => {
    const dupIndex = duplicatedObjects.findIndex(
      (i) =>
        i.tag === x.tag &&
        i.type === x.type &&
        i.from === x.from &&
        i.to === x.to &&
        specificTypes.includes(isMetadataAction ? i.metadata.action : i.type)
    );
    if (dupIndex === -1) {
      duplicatedObjects.push({
        ...x,
        duplicatedObjects: [x.metadata],
        action_id: id + idx,
      });
    } else {
      duplicatedObjects[dupIndex].duplicatedObjects.push(x.metadata);
    }
  });

  return duplicatedObjects;
};
const RenderFeedContent = (props) => {
  const { actions, tag, openModal, network, id } = props;
  switch (tag) {
    case "social":
      return (
        <SocialCard
          openModal={openModal}
          actions={resolveDuplicatedActions(
            actions,
            id,
            ["renew", "update"],
            true
          )}
        />
      );
    case "exchange":
    case "transaction":
      return (
        <TransactionCard
          id={id}
          actions={resolveDuplicatedActions(actions, id, [
            ActivityType.transfer,
          ])}
        />
      );
    case "collectible":
      return (
        <CollectibleCard
          network={network}
          openModal={openModal}
          actions={resolveDuplicatedActions(actions, id, [
            ActivityType.mint,
            ActivityType.trade,
          ])}
        />
      );
    default:
      return <DefaultCard id={id} actions={actions} />;
  }
};

const RenderFeedItem = (props) => {
  const { feed, identity, openModal } = props;
  const isOwner = isSameAddress(feed.owner, identity.address);
  const platformName = feed.platform?.toLowerCase();
  const networkName = feed.network?.toLowerCase();
  const actions = feed.actions?.filter((x) => x);
  if (!actions?.length) return null;

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
              href={resolveIPFS_URL(actions?.[0]?.related_urls?.[0]) || ""}
              target="_blank"
              className="feed-timestamp"
            >
              <span className="hide-sm">
                {new Date(feed.timestamp * 1000).toLocaleString()}
              </span>
              <span className="show-sm">
                {new Date(feed.timestamp * 1000).toLocaleDateString()}
              </span>
            </Link>
            <ActionExternalMenu
              links={actions?.[0]?.related_urls.map((x) => resolveIPFS_URL(x))}
            />
          </div>
        </div>
        <RenderFeedContent
          network={feed.network}
          openModal={openModal}
          id={feed.id}
          actions={actions}
          tag={feed.tag}
        />
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
