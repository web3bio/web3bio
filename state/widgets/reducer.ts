import { createReducer } from "@reduxjs/toolkit";
import {
  updateDegenWidget,
  updateNFTWidget,
  updatePoapsWidget,
  updateRssWidget,
  updateFeedsWidget,
  updatePhilandWidget,
  updateTallyDAOWidget,
  updateArticleWidget,
} from "./action";

interface WidgetStateDetail {
  isEmpty?: boolean | null;
  initLoading?: boolean;
  position?: string;
  loaded?: boolean | null;
}
export interface WidgetState {
  nft: WidgetStateDetail;
  feeds?: WidgetStateDetail;
  poaps?: WidgetStateDetail;
  rss?: WidgetStateDetail;
  article?: WidgetStateDetail;
  tally?: WidgetStateDetail;
  degen?: WidgetStateDetail;
  philand?: WidgetStateDetail;
}

export const initialState: WidgetState = {
  nft: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  feeds: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  poaps: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  rss: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  article: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  tally: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  degen: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  philand: {
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
        state.nft = {
          ...state.nft,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateFeedsWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.feeds = {
          ...state.feeds,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updatePoapsWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.poaps = {
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateRssWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.rss = {
          ...state.rss,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateArticleWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.article = {
          ...state.article,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateTallyDAOWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.tally = {
          ...state.tally,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateDegenWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.degen = {
          ...state.degen,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updatePhilandWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.philand = {
          ...state.philand,
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
);
