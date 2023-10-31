import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { ActivityTypeMapping, resolveMediaURL } from "../../utils/utils";
import { RenderToken } from "./FeedItem";
import { NFTAssetPlayer } from "../shared/NFTAssetPlayer";

const RenderDonationCard = (props) => {
  const { action } = props;
  const metadata = action?.metadata;
  
  switch (action.type) {
    case ("donate"):
      return (
        <>
          <div className="feed-content">
            {ActivityTypeMapping(action.type).action["default"]}
            {RenderToken(metadata.token)}
            &nbsp;{ActivityTypeMapping(action.type).prep}&nbsp;
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
    default:
      return (
        <div className="feed-content">
          {ActivityTypeMapping(action.type).action["default"]}
        </div>
      );
  }
};

export const DonationCard = memo(RenderDonationCard);