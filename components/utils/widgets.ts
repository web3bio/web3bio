export enum WidgetTypes {
  nft = "nft",
  poaps = "poaps",
  feeds = "feeds",
  rss = "rss",
  article = "article",
  degenscore = "degenscore",
  philand = "philand",
  tally = "tally",
  webacy = "webacy",
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
    [WidgetTypes.degenscore]: {
      key: "degenscore",
      icon: "👾",
      title: "DegenScore",
      description:
        "The DegenScore Beacon is an Ethereum soulbound token that highlights your on-chain skills & traits across one or more wallets.\nUse it to leverage your on-chain reputation in the DegenScore Cafe and across Web3.",
    },
    [WidgetTypes.philand]: {
      key: "philand",
      icon: "🏝️",
      title: "Phi Land",
      description:
        "Phi is a new Web3 world created from ENS domains & On-Chain Activity, enabling the easy visualization of On-Chain Identities, currently built on Polygon. Virtually interact with crypto protocols from around the Ethereum ecosystem.",
    },
    [WidgetTypes.webacy]: {
      key: "webacy",
      icon: "🪪",
      title: "Webacy",
      description: "Webacy description",
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
