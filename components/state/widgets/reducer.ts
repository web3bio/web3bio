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
    children: [
      WidgetTypes.degenscore,
      WidgetTypes.gitcoin,
      WidgetTypes.talent,
      WidgetTypes.webacy,
    ],
  },
  [WidgetTypes.article]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.poaps]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.guild]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.snapshot]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.tally]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.philand]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetTypes.degenscore]: {
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
  [WidgetTypes.talent]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetTypes.scores,
  },
  [WidgetTypes.webacy]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetTypes.scores,
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
export const updateDegenscoreWidget = createAction<UpdateWidgetState>(
  WidgetTypes.degenscore
);
export const updateGitcoinWidget = createAction<UpdateWidgetState>(
  WidgetTypes.gitcoin
);
export const updateSnapshotWidget = createAction<UpdateWidgetState>(
  WidgetTypes.snapshot
);

export const updateTalentWidget = createAction<UpdateWidgetState>(
  WidgetTypes.talent
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
  updateDegenscoreWidget,
  updateGitcoinWidget,
  updateSnapshotWidget,
  updateTalentWidget,
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
