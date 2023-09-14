import { createAction } from "@reduxjs/toolkit";

export const updateNFTWidget = createAction<{ nfts: any[]; address: string }>(
  "widgets/nft"
);

export const updatePoapsWidget = createAction<{
  poaps: any[];
  address: string;
}>("widgets/poaps");
export const updateRssWidget = createAction<{ rss: any[]; address: string }>(
  "widgets/rss"
);

export const updateDegenWidget = createAction<{
  degens: any[];
  address: string;
}>("widgets/degen");
