import { createReducer, createAction } from "@reduxjs/toolkit";
import { WidgetTypes } from "../../utils/widgets";

interface UpdateWidgetState {
  isEmpty: boolean;
  initLoading: boolean;
}

interface WidgetStateDetail {
  isEmpty?: boolean | null;
  initLoading?: boolean;
  position?: string;
  loaded?: boolean | null;
  parent?: WidgetTypes | null;
  children?: WidgetTypes[] | null;
}

export type WidgetState = {
  [index in WidgetTypes]: WidgetStateDetail;
};

export const initialState: WidgetState = {
  [WidgetTypes.nft]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.feeds]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.scores]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    children: [WidgetTypes.webacy, WidgetTypes.degen],
  },
  [WidgetTypes.article]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.poaps]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.guild]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.tally]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.philand]: { isEmpty: null, initLoading: true, loaded: false },
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
  [WidgetTypes.snapshot]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
  },
};

const updateWidget = createAction<{
  widgetType: WidgetTypes;
  isEmpty: boolean | null;
  initLoading: boolean;
}>("updateWidget");

export const updateNFTWidget = createAction<UpdateWidgetState>(WidgetTypes.nft);
export const updatePoapsWidget = createAction<UpdateWidgetState>(
  WidgetTypes.poaps
);
export const updateFeedsWidget = createAction<UpdateWidgetState>(
  WidgetTypes.feeds
);
export const updateScoresWidget = createAction<UpdateWidgetState>(
  WidgetTypes.scores
);
export const updateArticleWidget = createAction<UpdateWidgetState>(
  WidgetTypes.article
);
export const updateGuildWidget = createAction<UpdateWidgetState>(
  WidgetTypes.guild
);
export const updateTallyDAOWidget = createAction<UpdateWidgetState>(
  WidgetTypes.tally
);
export const updatePhilandWidget = createAction<UpdateWidgetState>(
  WidgetTypes.philand
);
export const updateWebacyWidget = createAction<UpdateWidgetState>(
  WidgetTypes.webacy
);
export const updateDegenWidget = createAction<UpdateWidgetState>(
  WidgetTypes.degen
);
export const updateGitcoinWidget = createAction<UpdateWidgetState>(
  WidgetTypes.gitcoin
);
export const updateAirstackScoresWidget = createAction<UpdateWidgetState>(
  WidgetTypes.airstackScores
);
export const updateSnapshotScoresWidget = createAction<UpdateWidgetState>(
  WidgetTypes.snapshot
);

const widgetActions = [
  updateNFTWidget,
  updatePoapsWidget,
  updateFeedsWidget,
  updateScoresWidget,
  updateArticleWidget,
  updateGuildWidget,
  updateTallyDAOWidget,
  updatePhilandWidget,
  updateWebacyWidget,
  updateDegenWidget,
  updateGitcoinWidget,
  updateAirstackScoresWidget,
  updateSnapshotScoresWidget,
];

export default createReducer(initialState, (builder) => {
  builder.addCase(updateWidget, (state, action) => {
    const { widgetType, isEmpty, initLoading } = action.payload;
    state[widgetType] = {
      ...state[widgetType],
      isEmpty,
      initLoading,
      loaded: true,
    };
  });

  widgetActions.forEach((action) => {
    builder.addCase(action, (state, { payload: { isEmpty, initLoading } }) => {
      const widgetType = action.type;
      state[widgetType] = {
        ...state[widgetType],
        isEmpty,
        initLoading,
        loaded: true,
      };
    });
  });
});
