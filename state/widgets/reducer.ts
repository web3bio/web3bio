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
  key?: string;
  icon?: string;
}
export interface WidgetState {
  nft: WidgetStateDetail;
  poaps?: WidgetStateDetail;
  feeds?: WidgetStateDetail;
  degen?: WidgetStateDetail;
  rss?: WidgetStateDetail;
  philand?: WidgetStateDetail;
  dao?: WidgetStateDetail;
  article?: WidgetStateDetail;
}

export const initialState: WidgetState = {
  nft: {
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
  degen: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  feeds: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  philand: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  dao: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  article: {
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
          icon: "🖼",
          key: "nft",
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
          icon: "🔮",
          key: "poap",
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
          icon: "📰",
          key: "rss",
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
          icon: "👾",
          key: "degen",
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
          icon: "🌈",
          key: "feeds",
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
          icon: "🏝️",
          key: "philand",
        };
      }
    )
    .addCase(
      updateTallyDAOWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.dao = {
          ...state.dao,
          isEmpty,
          initLoading,
          loaded: true,
          icon: "🏛️",
          key: "tally",
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
          icon: "📑",
          key: "article",
        };
      }
    )
);
