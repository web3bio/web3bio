import Link from "next/link";
import { memo } from "react";
import { ActivityTypeMapping, resolveMediaURL } from "../../utils/utils";
import { RenderToken } from "./FeedItem";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { isArray } from "@apollo/client/cache/inmemory/helpers";
import { ActivityType } from "../../utils/activity";

const RenderDefaultCard = (props) => {
  const { actions, id } = props;
  return actions?.map((action, idx) => {
    const metadata = action?.metadata;
    const actionId = id + idx;
    const renderContent = (() => {
      switch (action.type) {
        case ActivityType.donate:
          return (
            <>
              <div className="feed-content">
                {
                  ActivityTypeMapping(action.type).action[
                    metadata?.action || "default"
                  ]
                }
                &nbsp;
                {RenderToken({
                  key: `${actionId}_${ActivityType.donate}_${metadata?.token.name}`,
                  name: metadata.token.name,
                  symbol: metadata.token.symbol,
                  image: metadata.token.image,
                  value: {
                    value: metadata.token.value,
                    decimals: metadata.token.decimals,
                  },
                })}
                &nbsp;
                {ActivityTypeMapping(action.type).prep}
                &nbsp;
                <strong>{metadata.title}</strong>
                {action.platform && (
                  <span className="feed-platform">
                    &nbsp;on {action.platform}
                  </span>
                )}
              </div>
              {metadata && (
                <div className="feed-content">
                  <Link
                    className="feed-target"
                    href={action.related_urls[action.related_urls.length - 1]}
                    target="_blank"
                  >
                    <div className="feed-target-name">
                      <strong>{metadata.title}</strong>
                    </div>
                    <div className="feed-target-content">
                      <NFTAssetPlayer
                        className="feed-content-img float-right"
                        src={resolveMediaURL(metadata.logo)}
                        height={40}
                        width={40}
                        placeholder={true}
                        type={"image/png"}
                        alt={metadata.title}
                      />
                      <div className="feed-target-description">
                        {metadata.description}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </>
          );
        case ActivityType.vote:
          const choices = JSON.parse(metadata?.choice || "[]");
          return (
            <>
              <div className="feed-content">
                {
                  ActivityTypeMapping(action.type).action[
                    metadata?.action || "default"
                  ]
                }
                &nbsp;
                {isArray(choices) ? (
                  choices.map((x) => (
                    <span className="feed-token" key={x}>
                      {metadata.proposal?.options[x - 1]}
                    </span>
                  ))
                ) : (
                  <span className="feed-token">
                    {metadata.proposal?.options[choices - 1]}
                  </span>
                )}
                {action.platform && (
                  <span className="feed-platform">
                    &nbsp;on {action.platform}
                  </span>
                )}
              </div>
              {metadata.proposal && (
                <div className="feed-content">
                  <Link
                    className="feed-target"
                    href={metadata.proposal?.link}
                    target="_blank"
                  >
                    <div className="feed-target-name">
                      <strong>{metadata.proposal?.title}</strong>
                    </div>
                    <div className="feed-target-content">
                      {metadata.proposal?.organization.name}&nbsp;
                      <small className="text-gray-dark">
                        ({metadata.proposal?.organization.id})
                      </small>
                    </div>
                  </Link>
                </div>
              )}
            </>
          );
        default:
          return (
            <div className="feed-content">
              {
                ActivityTypeMapping(action.type).action[
                  metadata?.action || "default"
                ]
              }
              {action.platform && (
                <span className="feed-platform">
                  &nbsp;on {action.platform}
                </span>
              )}
            </div>
          );
      }
    })();
    return (
      <div className="feed-item-body" key={actionId}>
        {renderContent}
      </div>
    );
  });
};

export const DefaultCard = memo(RenderDefaultCard);
