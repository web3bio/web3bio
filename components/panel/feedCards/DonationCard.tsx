import { memo } from "react";
import { Tag } from "../../apis/rss3/types";

export function isDonationFeed(feed) {
  return feed.tag === Tag.Donation;
}

const RenderDonationCard = () => {
  return <div>donate</div>;
};

export const DonationCard = memo(RenderDonationCard);
