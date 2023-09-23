import { createAction } from "@reduxjs/toolkit";

export const updateNFTWidget = createAction<{ isEmpty: boolean }>(
  "widgets/nft"
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
