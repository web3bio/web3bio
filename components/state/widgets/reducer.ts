import { createReducer } from "@reduxjs/toolkit";
import {
  updateDegenscoreWidget,
  updateNFTWidget,
  updatePoapsWidget,
  updateRssWidget,
  updateFeedsWidget,
  updatePhilandWidget,
  updateTallyDAOWidget,
  updateArticleWidget,
  updateScoresWidget,
} from "./action";
import { WidgetTypes } from "../../utils/widgets";

interface WidgetStateDetail {
  isEmpty?: boolean | null;
  initLoading?: boolean;
  position?: string;
  loaded?: boolean | null;
}
export interface WidgetState {
  [WidgetTypes.nft]: WidgetStateDetail;
  [WidgetTypes.feeds]?: WidgetStateDetail;
  [WidgetTypes.poaps]?: WidgetStateDetail;
  [WidgetTypes.rss]?: WidgetStateDetail;
  [WidgetTypes.article]?: WidgetStateDetail;
  [WidgetTypes.tally]?: WidgetStateDetail;
  [WidgetTypes.degenscore]?: WidgetStateDetail;
  [WidgetTypes.philand]?: WidgetStateDetail;
  [WidgetTypes.scores]?: WidgetStateDetail;
}

export const initialState: WidgetState = {
  [WidgetTypes.nft]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.feeds]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.poaps]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.rss]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.article]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.tally]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.degenscore]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.philand]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.scores]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      updateNFTWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.nft] = {
          ...state[WidgetTypes.nft],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateFeedsWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.feeds] = {
          ...state[WidgetTypes.feeds],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updatePoapsWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.poaps] = {
          ...state[WidgetTypes.poaps],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateRssWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.rss] = {
          ...state[WidgetTypes.rss],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateArticleWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.article] = {
          ...state[WidgetTypes.article],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateTallyDAOWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.tally] = {
          ...state[WidgetTypes.tally],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateDegenscoreWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.degenscore] = {
          ...state[WidgetTypes.degenscore],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updatePhilandWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.philand] = {
          ...state[WidgetTypes.philand],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateScoresWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.scores] = {
          ...state[WidgetTypes.scores],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
);
