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
    position?: string;
  };
  poaps?: {
    isEmpty: boolean | null;
    position?: string;
  };
  feeds?: {
    isEmpty: boolean | null;
    position?: string;
  };
  degen?: {
    isEmpty: boolean | null;
    position?: string;
  };
  rss?: {
    isEmpty: boolean | null;
    position?: string;
  };
}

export const initialState: WidgetState = {
  nft: {
    isEmpty: null,
  },
  poaps: {
    isEmpty: null,
  },
  rss: {
    isEmpty: null,
  },
  degen: {
    isEmpty: null,
  },
  feeds: {
    isEmpty: null,
  },
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateNFTWidget, (state, { payload: { isEmpty } }) => {
      state.nft = {
        ...state.nft,
        isEmpty,
      };
    })
    .addCase(updatePoapsWidget, (state, { payload: { isEmpty } }) => {
      state.poaps = {
        ...state.poaps,
        isEmpty,
      };
    })
    .addCase(updateRssWidget, (state, { payload: { isEmpty } }) => {
      state.rss = {
        ...state.rss,
        isEmpty,
      };
    })
    .addCase(updateDegenWidget, (state, { payload: { isEmpty } }) => {
      state.degen = {
        ...state.degen,
        isEmpty,
      };
    })
    .addCase(updateFeedsWidget, (state, { payload: { isEmpty } }) => {
      state.feeds = {
        ...state.feeds,
        isEmpty,
      };
    })
);
