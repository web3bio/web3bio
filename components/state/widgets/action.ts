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
export const updateScoresWidget =
  createAction<UpdateWidgetState>("widgets/scores");
export const updateArticleWidget =
  createAction<UpdateWidgetState>("widgets/article");
export const updateTallyDAOWidget =
  createAction<UpdateWidgetState>("widgets/tallyDAO");
export const updatePhilandWidget =
  createAction<UpdateWidgetState>("widgets/philand");
export const updateWebacyWidget =
  createAction<UpdateWidgetState>("widgets/webacy");
export const updateAirstackScoresWidget = createAction<UpdateWidgetState>(
  "widgets/airstackScores"
);
export const updateDegenWidget =
  createAction<UpdateWidgetState>("widgets/degen");
export const updateGitcoinWidget =
  createAction<UpdateWidgetState>("widgets/gitcoin");
export const updateGuildWidget =
  createAction<UpdateWidgetState>("widgets/guild");
