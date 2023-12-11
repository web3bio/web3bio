import { createReducer } from "@reduxjs/toolkit";
import {
  updateDegenWidget,
  updateNFTWidget,
  updatePoapsWidget,
  updateRssWidget,
  updateFeedsWidget,
} from "./action";

export interface WidgetState {
  nft: {
    isEmpty?: boolean | null;
    initLoading?: boolean;
    position?: string;
  };
  poaps?: {
    isEmpty: boolean | null;
    initLoading?: boolean;
    position?: string;
  };
  feeds?: {
    isEmpty: boolean | null;
    initLoading?: boolean;
    position?: string;
  };
  degen?: {
    isEmpty: boolean | null;
    initLoading?: boolean;
    position?: string;
  };
  rss?: {
    isEmpty: boolean | null;
    initLoading?: boolean;
    position?: string;
  };
}

export const initialState: WidgetState = {
  nft: {
    isEmpty: null,
    initLoading: true,
  },
  poaps: {
    isEmpty: null,
    initLoading: true,
  },
  rss: {
    isEmpty: null,
    initLoading: true,
  },
  degen: {
    isEmpty: null,
    initLoading: true,
  },
  feeds: {
    isEmpty: null,
    initLoading: true,
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
        };
      }
    )
    .addCase(
      updatePoapsWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state.poaps = {
          ...state.poaps,
          isEmpty,
          initLoading,
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
        };
      }
    )
);
