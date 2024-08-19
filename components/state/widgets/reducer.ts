import { createReducer, createAction } from "@reduxjs/toolkit";
import { WidgetType } from "../../utils/widgets";

interface UpdateWidgetState {
  isEmpty: boolean;
  initLoading: boolean;
}

interface WidgetStateDetail {
  isEmpty?: boolean | null;
  initLoading?: boolean;
  position?: string;
  loaded?: boolean | null;
  parent?: WidgetType | null;
  children?: WidgetType[] | null;
}

export type WidgetState = {
  [index in WidgetType]: WidgetStateDetail;
};

export const initialState: WidgetState = {
  [WidgetType.nft]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.feeds]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.scores]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    children: [
      WidgetType.degenscore,
      WidgetType.gitcoin,
      WidgetType.talent,
      WidgetType.webacy,
    ],
  },
  [WidgetType.article]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.poaps]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.guild]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.snapshot]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.tally]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.philand]: { isEmpty: null, initLoading: true, loaded: false },
  [WidgetType.degenscore]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetType.scores,
  },
  [WidgetType.gitcoin]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetType.scores,
  },
  [WidgetType.talent]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetType.scores,
  },
  [WidgetType.webacy]: {
    isEmpty: null,
    initLoading: true,
    loaded: false,
    parent: WidgetType.scores,
  },
};

const updateWidget = createAction<{
  widgetType: WidgetType;
  isEmpty: boolean | null;
  initLoading: boolean;
}>("updateWidget");

export const updateNFTWidget = createAction<UpdateWidgetState>(WidgetType.nft);
export const updatePoapsWidget = createAction<UpdateWidgetState>(
  WidgetType.poaps
);
export const updateFeedsWidget = createAction<UpdateWidgetState>(
  WidgetType.feeds
);
export const updateScoresWidget = createAction<UpdateWidgetState>(
  WidgetType.scores
);
export const updateArticleWidget = createAction<UpdateWidgetState>(
  WidgetType.article
);
export const updateGuildWidget = createAction<UpdateWidgetState>(
  WidgetType.guild
);
export const updateTallyDAOWidget = createAction<UpdateWidgetState>(
  WidgetType.tally
);
export const updatePhilandWidget = createAction<UpdateWidgetState>(
  WidgetType.philand
);
export const updateWebacyWidget = createAction<UpdateWidgetState>(
  WidgetType.webacy
);
export const updateDegenscoreWidget = createAction<UpdateWidgetState>(
  WidgetType.degenscore
);
export const updateGitcoinWidget = createAction<UpdateWidgetState>(
  WidgetType.gitcoin
);
export const updateSnapshotWidget = createAction<UpdateWidgetState>(
  WidgetType.snapshot
);

export const updateTalentWidget = createAction<UpdateWidgetState>(
  WidgetType.talent
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
