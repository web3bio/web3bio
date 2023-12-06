import { createAction } from "@reduxjs/toolkit";

export const updateNFTWidget = createAction<{ isEmpty: boolean }>(
  "widgets/nft"
);
export const updateFeedsWidget = createAction<{ isEmpty: boolean }>(
  "widgets/feeds"
);
export const updatePoapsWidget = createAction<{
  isEmpty: boolean;
}>("widgets/poaps");
export const updateRssWidget = createAction<{ isEmpty: boolean }>(
  "widgets/rss"
);
export const updateDegenWidget = createAction<{
  isEmpty: boolean;
}>("widgets/degen");
