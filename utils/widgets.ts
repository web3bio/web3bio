export enum WidgetTypes {
  nft = "nft",
  poaps = "poaps",
  feeds = "feeds",
  rss = "rss",
  article = "article",
  degen = "degen",
  philand = "philand",
  tally = "tally",
  default = "default",
}
export const WidgetInfoMapping = (widgetType: WidgetTypes) => {
  const WidgetsInfoData = {
    [WidgetTypes.nft]: {
      key: "nft",
      icon: "🖼",
      description: "",
    },
    [WidgetTypes.feeds]: {
      key: "feeds",
      icon: "🌈",
      description: "",
      defaultOrder: 1,
    },
    [WidgetTypes.poaps]: {
      key: "poaps",
      icon: "🔮",
      description: "",
    },
    [WidgetTypes.rss]: {
      key: "rss",
      icon: "📰",
      description: "",
    },
    [WidgetTypes.article]: {
      key: "article",
      icon: "📑",
      description: "",
    },
    [WidgetTypes.tally]: {
      key: "tally",
      icon: "🏛️",
      description: "",
    },
    [WidgetTypes.degen]: {
      key: "degen",
      icon: "👾",
      description: "",
    },
    [WidgetTypes.philand]: {
      key: "philand",
      icon: "🏝️",
      description: "",
    },
  };
};
