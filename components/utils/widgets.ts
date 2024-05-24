export enum WidgetTypes {
  nft = "nft",
  poaps = "poaps",
  feeds = "feeds",
  rss = "rss",
  article = "article",
  philand = "philand",
  tally = "tally",
  degen = "degen",
  webacy = "webacy",
  walletLabels = "walletLabels",
  scores = "scores",
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
      description:
        "POAP is a curated ecosystem for the preservation of memories. By checking-in at different events, POAP collectors build a digital scrapbook where each POAP is an anchor to a place and space in time.",
    },
    [WidgetTypes.rss]: {
      key: "rss",
      icon: "🌐",
      title: "Website",
      description: "",
    },
    [WidgetTypes.article]: {
      key: "article",
      icon: "📰",
      title: "Articles",
      description: "",
    },
    [WidgetTypes.tally]: {
      key: "tally",
      icon: "🏛️",
      title: "DAO Memberships",
      description: "",
    },
    [WidgetTypes.philand]: {
      key: "philand",
      icon: "🏝️",
      title: "Phi Land",
      description:
        "Phi is a new Web3 world created from ENS domains & On-Chain Activity, enabling the easy visualization of On-Chain Identities, currently built on Polygon. Virtually interact with crypto protocols from around the Ethereum ecosystem.",
    },
    [WidgetTypes.scores]: {
      key: "scores",
      icon: "🪪",
      title: "Web3 Scores",
      description: "",
    },
    [WidgetTypes.degen]: {
      key: "degen",
      icon: "👾",
      title: "Degen Score",
      description: "",
    },
    [WidgetTypes.webacy]: {
      key: "webacy",
      icon: "🚨",
      title: "Webacy ",
      description: "",
    },
    [WidgetTypes.walletLabels]: {
      key: "walletLabels",
      icon: "😊",
      title: "Wallet Labels",
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
