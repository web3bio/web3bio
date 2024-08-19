export enum WidgetType {
  nft = "nft",
  poaps = "poaps",
  feeds = "feeds",
  scores = "scores",
  article = "article",
  philand = "philand",
  tally = "tally",
  degenscore = "degenscore",
  webacy = "webacy",
  gitcoin = "gitcoin",
  guild = "guild",
  snapshot = "snapshot",
  talent = "talent",
}

interface WidgetInfo {
  icon: string;
  title: string;
  description: string;
}

const WidgetsInfoData: Readonly<Record<WidgetType, WidgetInfo>> = {
  [WidgetType.nft]: {
    icon: "🖼",
    title: "NFT Collections",
    description: "",
  },
  [WidgetType.feeds]: {
    icon: "🌈",
    title: "Activity Feeds",
    description: "",
  },
  [WidgetType.poaps]: {
    icon: "🔮",
    title: "POAPs",
    description:
      "POAP is a curated ecosystem for the preservation of memories. By checking-in at different events, POAP collectors build a digital scrapbook where each POAP is an anchor to a place and space in time.",
  },
  [WidgetType.scores]: {
    icon: "🏆",
    title: "Badges and Scores",
    description: "",
  },
  [WidgetType.article]: {
    icon: "📰",
    title: "Articles",
    description: "",
  },
  [WidgetType.tally]: {
    icon: "🏛️",
    title: "DAO Memberships",
    description: "",
  },
  [WidgetType.philand]: {
    icon: "🏝️",
    title: "Phi Land",
    description:
      "Phi is a new Web3 world created from ENS domains & On-Chain Activity, enabling the easy visualization of On-Chain Identities, currently built on Polygon. Virtually interact with crypto protocols from around the Ethereum ecosystem.",
  },
  [WidgetType.degenscore]: {
    icon: "👾",
    title: "DegenScore",
    description:
      "The DegenScore Beacon is an Ethereum soulbound token that highlights your on-chain skills & traits across one or more wallets.",
  },
  [WidgetType.webacy]: {
    icon: "🛡️",
    title: "Webacy",
    description:
      "Powered by Webacy's proprietary algorithm, the Safety Score gives you a real-time understanding of your wallet risk and vulnerabilities to attack vectors. ",
  },
  [WidgetType.gitcoin]: {
    icon: "🌀",
    title: "Gitcoin Passport",
    description:
      "Gitcoin Passport helps you collect “stamps” that prove your humanity and reputation. You decide what stamps are shown. And your privacy is protected at each step of the way.",
  },
  [WidgetType.guild]: {
    icon: "🏰",
    title: "Guilds",
    description:
      "Automated membership management for the platforms your community already uses.",
  },
  [WidgetType.snapshot]: {
    icon: "⚡️",
    title: "Snapshot",
    description: "Snapshot - Where decisions get made.",
  },
  [WidgetType.talent]: {
    icon: "🛠️",
    title: "Talent Passport",
    description: "A new type of resume, for the onchain era of the internet.",
  },
} as const;

export const WidgetInfoMapping = (
  widgetType: WidgetType
): Readonly<WidgetInfo> => WidgetsInfoData[widgetType];
