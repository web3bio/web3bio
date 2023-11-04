import Link from "next/link";
import { memo } from "react";
import { ActivityTypeMapping, resolveMediaURL } from "../../utils/utils";
import { RenderToken } from "./FeedItem";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";
import { isArray } from "@apollo/client/cache/inmemory/helpers";

const RenderDefaultCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;

  switch (action.type) {
    case ("donate"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
            {RenderToken(metadata.token)}&nbsp;
            {ActivityTypeMapping(action.type).prep}&nbsp;
            <strong>{metadata.title}</strong>
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
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
                  <strong>
                  {metadata.title}
                  </strong>
                </div>
                <div className="feed-target-content">
                  <NFTAssetPlayer
                    className="feed-content-img float-right"
                    src={resolveMediaURL(metadata.logo)}
                    height={40}
                    width={40}
                    type={"image/png"}
                  />
                  <div className="feed-target-description">{metadata.description}</div>
                </div>
              </Link>
            </div>
          )}
        </>
      );
    case ("vote"):
      const choices = JSON.parse(metadata.choice || "[]");
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action[metadata.action||"default"]}&nbsp;
            {isArray(choices) ? (
                choices.map((x) => (
                  <span className="feed-token" key={x}>{metadata.proposal?.options[x - 1]}</span>
                )
              )) : (
                <span className="feed-token">{metadata.proposal?.options[choices - 1]}</span>
              )
            }
            {action.platform && (
              <span className="feed-platform">&nbsp;on {action.platform}</span>
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
                  <strong>
                  {metadata.proposal?.title}
                  </strong>
                </div>
                <div className="feed-target-content">
                  {metadata.proposal?.organization.name} <small className="text-gray-dark">({metadata.proposal?.organization.id})</small>
                </div>
              </Link>
            </div>
          )}
        </>
      );
    default:
      return (
        <div className="feed-content">
          {ActivityTypeMapping(action.type).action[metadata.action||"default"]}
          {action.platform && (
            <span className="feed-platform">&nbsp;on {action.platform}</span>
          )}
        </div>
      );
  }
};

export const DefaultCard = memo(RenderDefaultCard);