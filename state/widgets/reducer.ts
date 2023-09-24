import { createReducer } from "@reduxjs/toolkit";
import {
  updateDegenWidget,
  updateNFTWidget,
  updatePoapsWidget,
  updateRssWidget,
} from "./action";

export interface WidgetState {
  widgetState: {
    nft: {
      isEmpty?: boolean;
      position?: string;
    };
    poaps?: {
      isEmpty: boolean;
      position?: string;
    };
    degen?: {
      isEmpty: boolean;
      position?: string;
    };
    rss?: {
      isEmpty: boolean;
      position?: string;
    };
  };
}

export const initialState: WidgetState = {
  widgetState: {
    nft: {
      isEmpty: true,
    },
    poaps: {
      isEmpty: true,
    },
    rss: {
      isEmpty: true,
    },
    degen: {
      isEmpty: true,
    },
  },
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateNFTWidget, (state, { payload: { isEmpty } }) => {
      state.widgetState = {
        ...state.widgetState,
        nft: {
          isEmpty,
        },
      };
    })
    .addCase(updatePoapsWidget, (state, { payload: { isEmpty } }) => {
      state.widgetState = {
        ...state.widgetState,
        poaps: {
          isEmpty,
        },
      };
    })
    .addCase(updateRssWidget, (state, { payload: { isEmpty } }) => {
      state.widgetState = {
        ...state.widgetState,
        rss: {
          isEmpty,
        },
      };
    })
    .addCase(updateDegenWidget, (state, { payload: { isEmpty } }) => {
      state.widgetState = {
        ...state.widgetState,
        degen: {
          isEmpty,
        },
      };
    })
);
