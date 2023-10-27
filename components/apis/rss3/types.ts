export enum ActivityTag {
  collectible = "collectible",
  donation = "donation",
  exchange = "exchange",
  governance = "governance",
  social = "social",
  metaverse = "metaverse",
  transaction = "transaction",
  unknown = 'unknown',
}

export enum ActivityType {
  approval = "approval",
  auction = "auction",
  bridge = "bridge",
  burn = "burn",
  claim = "claim",
  comment = "comment",
  delete = "delete",
  deploy = "deploy",
  donate = "donate",
  liquidity = "liquidity",
  loan = "loan",
  mint = "mint",
  multisig = "multisig",
  post = "post",
  profile = "profile",
  propose = "propose",
  proxy = "proxy",
  revise = "revise",
  reward = "reward",
  share = "share",
  staking = "staking",
  swap = "swap",
  trade = "trade",
  transfer = "transfer",
  unknown = "unknown",
  vote = "vote",
}

export const ActivityTypeData: { [key in ActivityType]: ActivityTypeData } = {
  [ActivityType.approval]: {
    key: ActivityType.approval,
    emoji: "✅",
    label: "Approval",
    action: "Approvaled",
    prep: "to",
  },
  [ActivityType.auction]: {
    key: ActivityType.auction,
    emoji: "👨‍⚖",
    label: "Auction",
    action: "Auctioned",
    prep: "",
  },
  [ActivityType.bridge]: {
    key: ActivityType.bridge,
    emoji: "🌉",
    label: "Bridge",
    action: "Bridged",
    prep: "to",
  },
  [ActivityType.burn]: {
    key: ActivityType.burn,
    emoji: "🔥",
    label: "Burn",
    action: "Burned",
    prep: "",
  },
  [ActivityType.claim]: {
    key: ActivityType.claim,
    emoji: "📢",
    label: "Claim",
    action: "Claimed",
    prep: "",
  },
  [ActivityType.comment]: {
    key: ActivityType.comment,
    emoji: "💬",
    label: "Comment",
    action: "Commented",
    prep: "",
  },
  [ActivityType.delete]: {
    key: ActivityType.delete,
    emoji: "🗑️",
    label: "Delete",
    action: "Deleted",
    prep: "",
  },
  [ActivityType.deploy]: {
    key: ActivityType.deploy,
    emoji: "🚀",
    label: "Deploy",
    action: "Deployed",
    prep: "",
  },
  [ActivityType.donate]: {
    key: ActivityType.donate,
    emoji: "💌",
    label: "Donate",
    action: "Donated",
    prep: "to",
  },
  [ActivityType.liquidity]: {
    key: ActivityType.liquidity,
    emoji: "🏦",
    label: "Liquidity",
    action: "",
    prep: "",
  },
  [ActivityType.loan]: {
    key: ActivityType.loan,
    emoji: "💸",
    label: "Loan",
    action: "Loaned",
    prep: "to",
  },
  [ActivityType.mint]: {
    key: ActivityType.mint,
    emoji: "🖼️",
    label: "Mint",
    action: "Minted",
    prep: "",
  },
  [ActivityType.multisig]: {
    key: ActivityType.multisig,
    emoji: "✍🏻",
    label: "Multisig",
    action: "Multisiged",
    prep: "",
  },
  [ActivityType.post]: {
    key: ActivityType.post,
    emoji: "📄",
    label: "Post",
    action: "Posted",
    prep: "to",
  },
  [ActivityType.profile]: {
    key: ActivityType.profile,
    emoji: "👤",
    label: "Profile",
    action: "",
    prep: "",
  },
  [ActivityType.propose]: {
    key: ActivityType.propose,
    emoji: "📝",
    label: "Propose",
    action: "Proposed",
    prep: "",
  },
  [ActivityType.proxy]: {
    key: ActivityType.proxy,
    emoji: "🔮",
    label: "Proxy",
    action: "",
    prep: "",
  },
  [ActivityType.revise]: {
    key: ActivityType.revise,
    emoji: "✍🏻",
    label: "Revise",
    action: "",
    prep: "",
  },
  [ActivityType.reward]: {
    key: ActivityType.reward,
    emoji: "🍬",
    label: "Reward",
    action: "Rewarded",
    prep: "",
  },
  [ActivityType.share]: {
    key: ActivityType.share,
    emoji: "✨",
    label: "Share",
    action: "Shared",
    prep: "",
  },
  [ActivityType.staking]: {
    key: ActivityType.staking,
    emoji: "🏦",
    label: "Staking",
    action: "Staked",
    prep: "to",
  },
  [ActivityType.swap]: {
    key: ActivityType.swap,
    emoji: "💵",
    label: "Swap",
    action: "Swapped",
    prep: "to",
  },
  [ActivityType.trade]: {
    key: ActivityType.trade,
    emoji: "⚖️",
    label: "Trade",
    action: "Traded",
    prep: "",
  },
  [ActivityType.transfer]: {
    key: ActivityType.transfer,
    emoji: "💵",
    label: "Transfer",
    action: "Transferred",
    prep: "",
  },
  [ActivityType.unknown]: {
    key: ActivityType.unknown,
    emoji: "👽",
    label: "Unknown",
    action: "",
    prep: "",
  },
  [ActivityType.vote]: {
    key: ActivityType.vote,
    emoji: "🗳️",
    label: "Vote",
    action: "Voted",
    prep: "",
  },
}

export interface ActivityTypeData {
  key: string;
  emoji: string;
  label: string;
  action: string;
  prep: string;
}

export const ActivityTypeMapping = (type: ActivityType) => {
  return (
    ActivityTypeData[type] ?? {
      key: type,
      emoji: "",
      label: type,
      action: "",
      prep: "",
    }
  );
};