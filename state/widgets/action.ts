import { createAction } from "@reduxjs/toolkit";

interface UpdateWidgetState {
  isEmpty: boolean;
  initLoading: boolean;
}
export const updateNFTWidget = createAction<UpdateWidgetState>("widgets/nft");
export const updateFeedsWidget =
  createAction<UpdateWidgetState>("widgets/feeds");
export const updatePoapsWidget =
  createAction<UpdateWidgetState>("widgets/poaps");
export const updateRssWidget = createAction<UpdateWidgetState>("widgets/rss");
export const updateArticleWidget =
  createAction<UpdateWidgetState>("widgets/article");
export const updateTallyDAOWidget =
  createAction<UpdateWidgetState>("widgets/tallyDAO");
export const updateDegenWidget =
  createAction<UpdateWidgetState>("widgets/degen");
export const updatePhilandWidget =
  createAction<UpdateWidgetState>("widgets/philand");