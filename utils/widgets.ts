export enum WidgetTypes {
  nft = "nft",
  poaps = "poaps",
  feeds = "feeds",
  rss = "rss",
  article = "article",
  degenscore = "degenscore",
  philand = "philand",
  tally = "tally",
  default = "default",
}
export const WidgetInfoMapping = (widgetType: WidgetTypes) => {
  const WidgetsInfoData = {
    [WidgetTypes.nft]: {
      key: "nft",
      icon: "🖼",
      title: "NFT Collections",
      description: "",
    },
    [WidgetTypes.feeds]: {
      key: "feeds",
      icon: "🌈",
      title: "Activity Feeds",
      description: "",
    },
    [WidgetTypes.poaps]: {
      key: "poaps",
      icon: "🔮",
      title: "POAPs",
      description: "",
    },
    [WidgetTypes.rss]: {
      key: "rss",
      icon: "📰",
      title: "Website",
      description: "",
    },
    [WidgetTypes.article]: {
      key: "article",
      icon: "📑",
      title: "Articles",
      description: "",
    },
    [WidgetTypes.tally]: {
      key: "tally",
      icon: "🏛️",
      title: "DAO Memberships",
      description: "",
    },
    [WidgetTypes.degenscore]: {
      key: "degenscore",
      icon: "👾",
      title: "DegenScore",
      description: "",
    },
    [WidgetTypes.philand]: {
      key: "philand",
      icon: "🏝️",
      title: "Phi Land",
      description: "",
    },
  };
  return (
    WidgetsInfoData[widgetType] || {
      key: "default",
      icon: "😊",
      title: "",
      description: "",
    }
  );
};
