import { memo, useMemo } from "react";
import Link from "next/link";
import { resolveIPFS_URL } from "../utils/ipfs";
import SVG from "react-inlinesvg";
import { DefaultCard } from "./DefaultFeed";
import { formatText, isSameAddress, shouldPlatformFetch } from "../utils/utils";
import ActionExternalMenu from "./ActionExternalMenu";
import {
  ActivityTag,
  ActivityType,
  ActivityTypeMapping,
} from "../utils/activity";
import RenderProfileBadge from "../profile/RenderProfileBadge";
import { formatDistanceToNow } from "date-fns";
import { PlatformType } from "../utils/platform";
import { Network, NetworkMapping } from "../utils/network";
import FeedActionCard from "../profile/FeedActionCard";
import _ from "lodash";

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
  const { actions, tag, openModal, network, id, platform, owner } = props;
  let comProps = {};
  switch (tag) {
    case "social":
      comProps = {
        platform,
        openModal,
        actions: resolveDuplicatedActions(
          actions,
          id,
          ["renew", "update"],
          true
        ),
      };
      break;
    case "exchange":
    case "transaction":
      comProps = {
        id,
        network,
        openModal,
        owner,
        actions: _.sortBy(
          resolveDuplicatedActions(actions, id, [ActivityType.transfer]),
          (x) =>
            x.type !== ActivityType.multisig ||
            x.metadata.action !== "execution"
        ),
      };
      break;
    case "collectible":
      comProps = {
        id,
        network,
        openModal,
        actions: resolveDuplicatedActions(actions, id, [
          ActivityType.mint,
          ActivityType.trade,
          ActivityType.transfer,
        ]),
        owner,
      };
      break;
    default:
      return <DefaultCard id={id} actions={actions} />;
  }
  return <FeedActionCard {...comProps} />;
};

const renderFeedBadge = (key) => {
  return (
    <div
      className={`feed-icon-platform ${key}`}
      style={{ backgroundColor: NetworkMapping(key).bgColor }}
      title={NetworkMapping(key).label}
    >
      <SVG
        fill={NetworkMapping(key).primaryColor}
        src={NetworkMapping(key).icon || ""}
      />
    </div>
  );
};

const RenderFeedItem = (props) => {
  const { feed, identity, openModal, actions } = props;
  const isOwner = useMemo(
    () => isSameAddress(feed.owner, identity.address),
    [feed, identity]
  );
  const platformName = useMemo(() => feed.platform?.toLowerCase(), [feed]);
  const networkName = useMemo(() => feed.network?.toLowerCase(), [feed]);
  const feedOwner = useMemo(
    () =>
      isOwner
        ? identity.displayName || formatText(identity.address)
        : formatText(feed.from),
    [feed, identity, isOwner]
  );
  if (!actions?.length) return null;
  return (
    <>
      <div className="feed-item-icon">
        <div className="feed-icon-emoji">
          {ActivityTypeMapping(feed.type).emoji}
          {renderFeedBadge(
            feed.tag === ActivityTag.social
              ? networkName.replace(Network.polygon, Network.lens)
              : networkName
          )}
        </div>
      </div>
      <div className="feed-item-content">
        <div className="feed-item-header">
          <div className="feed-item-name">
            {(
              <RenderProfileBadge
                platform={
                  shouldPlatformFetch(platformName)
                    ? platformName
                    : PlatformType.ethereum
                }
                offset={[50, -5]}
                identity={
                  platformName === PlatformType.farcaster
                    ? feed?.actions?.[0]?.metadata?.handle
                    : feed.owner
                }
                remoteFetch
                fullProfile
              />
            ) || feedOwner}
          </div>
          <div className="feed-item-action dropdown dropdown-right">
            <Link
              href={resolveIPFS_URL(actions?.[0]?.related_urls?.[0]) || ""}
              target="_blank"
              className="feed-timestamp"
            >
              <span>
                {formatDistanceToNow(new Date(feed?.timestamp * 1000), {
                  addSuffix: false,
                })}
              </span>
            </Link>
            <ActionExternalMenu
              platform={platformName}
              date={feed.timestamp}
              action={actions?.[0]}
              links={actions?.[0]?.related_urls.map((x) => resolveIPFS_URL(x))}
            />
          </div>
        </div>
        <RenderFeedContent
          platform={platformName}
          network={networkName}
          openModal={openModal}
          id={feed.id}
          actions={actions}
          tag={feed.tag}
          owner={feed.owner}
        />
      </div>
    </>
  );
};

export const FeedItem = memo(RenderFeedItem);
