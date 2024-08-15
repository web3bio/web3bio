import { memo, useMemo } from "react";
import Link from "next/link";
import { resolveIPFS_URL } from "../utils/ipfs";
import SVG from "react-inlinesvg";
import { formatText, isSameAddress, shouldPlatformFetch } from "../utils/utils";
import ActionExternalMenu from "./ActionExternalMenu";
import { ActivityTag, ActivityTypeMapping } from "../utils/activity";
import RenderProfileBadge from "./RenderProfileBadge";
import { formatDistanceToNow } from "date-fns";
import { PlatformType } from "../utils/platform";
import { Network, NetworkMapping } from "../utils/network";
import { RenderFeedContent } from "./RenderFeedContent";

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
  const { feed, identity, openModal, actions, nftInfos } = props;
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
            feed.tag === ActivityTag.social ? platformName : networkName
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
          nftInfos={nftInfos}
          feed={feed}
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
