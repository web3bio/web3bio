import { createReducer } from "@reduxjs/toolkit";
import {
  updateDegenWidget,
  updateNFTWidget,
  updatePoapsWidget,
  updateRssWidget,
} from "./action";

interface WidgetState {
  data: {
    [address: string]: {
      nfts: {
        data: any;
      };
      poaps: {
        data: any;
      };
      degens: {
        data: any;
      };
      rss: {
        data: any;
      };
    };
  };
}

export const initialState: WidgetState = {
  data: {},
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateNFTWidget, (state, { payload: { nfts, address } }) => {
      state.data[address].nfts.data = nfts;
    })
    .addCase(updatePoapsWidget, (state, { payload: { poaps, address } }) => {
      state.data[address].poaps.data = poaps;
    })
    .addCase(updateRssWidget, (state, { payload: { rss, address } }) => {
      state.data[address].rss.data = rss;
    })
    .addCase(updateDegenWidget, (state, { payload: { degens, address } }) => {
      state.data[address].degens.data = degens;
    })
);
