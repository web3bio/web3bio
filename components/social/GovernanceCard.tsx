import Link from "next/link";
import { memo } from "react";
import { ActivityTypeMapping } from "../../utils/utils";
import { isArray } from "@apollo/client/cache/inmemory/helpers";

const RenderGovernanceCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;
  
  switch (action.type) {
    case ("vote"):
      const choices = JSON.parse(metadata.choice || "[]");
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["default"]}
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
          {ActivityTypeMapping(action.type).action["default"]}
          {action.platform && (
            <span className="feed-platform">&nbsp;on {action.platform}</span>
          )}
        </div>
      );
  }
};

export const GovernanceCard = memo(RenderGovernanceCard);