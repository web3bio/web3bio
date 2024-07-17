import { createReducer } from "@reduxjs/toolkit";
import {
  updateNFTWidget,
  updatePoapsWidget,
  updateFeedsWidget,
  updatePhilandWidget,
  updateTallyDAOWidget,
  updateArticleWidget,
  updateScoresWidget,
  updateWebacyWidget,
  updateDegenWidget,
  updateGitcoinWidget,
  updateAirstackScoresWidget,
  updateGuildWidget,
} from "./action";
import { WidgetTypes } from "../../utils/widgets";

interface WidgetStateDetail {
  isEmpty?: boolean | null;
  initLoading?: boolean;
  position?: string;
  loaded?: boolean | null;
  parent?: WidgetTypes | null;
  children?: WidgetTypes[] | null;
}
export interface WidgetState {
  [WidgetTypes.nft]: WidgetStateDetail;
  [WidgetTypes.feeds]?: WidgetStateDetail;
  [WidgetTypes.scores]?: WidgetStateDetail;
  [WidgetTypes.article]?: WidgetStateDetail;
  [WidgetTypes.poaps]?: WidgetStateDetail;
  [WidgetTypes.tally]?: WidgetStateDetail;
  [WidgetTypes.philand]?: WidgetStateDetail;
  [WidgetTypes.degen]?: WidgetStateDetail;
  [WidgetTypes.webacy]?: WidgetStateDetail;
  [WidgetTypes.gitcoin]?: WidgetStateDetail;
  [WidgetTypes.airstackScores]?: WidgetStateDetail;
  [WidgetTypes.guild]?: WidgetStateDetail;
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
  [WidgetTypes.scores]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    children: [WidgetTypes.webacy, WidgetTypes.degen],
  },
  [WidgetTypes.article]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.poaps]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.guild]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.tally]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.philand]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
  [WidgetTypes.webacy]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetTypes.scores,
  },
  [WidgetTypes.degen]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetTypes.scores,
  },
  [WidgetTypes.gitcoin]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetTypes.scores,
  },
  [WidgetTypes.airstackScores]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetTypes.scores,
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
      updateGuildWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.guild] = {
          ...state[WidgetTypes.guild],
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
      updateWebacyWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.webacy] = {
          ...state[WidgetTypes.webacy],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateDegenWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.degen] = {
          ...state[WidgetTypes.degen],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateGitcoinWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.gitcoin] = {
          ...state[WidgetTypes.gitcoin],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
    .addCase(
      updateAirstackScoresWidget,
      (state, { payload: { isEmpty, initLoading } }) => {
        state[WidgetTypes.airstackScores] = {
          ...state[WidgetTypes.airstackScores],
          isEmpty,
          initLoading,
          loaded: true,
        };
      }
    )
);
