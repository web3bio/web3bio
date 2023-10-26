import { ActivityType } from "./types";
export const RSS3_ENDPOINT = "https://testnet.rss3.io/";
export const RSS3Fetcher = async (url, options?) => {
  try {
    const res = await fetch(url, options).then((r) => r.json());
    return res;
  } catch {
    return null;
  }
};

export const FeedEmojiMapByType = {
  [ActivityType.Transfer]: "💵",
  [ActivityType.Mint]: "🖼️",
  [ActivityType.Burn]: "🔥",
  [ActivityType.Withdraw]: "💰",
  [ActivityType.Deposit]: "💰",
  [ActivityType.Swap]: "💵",
  [ActivityType.Liquidity]: "🌊",
  [ActivityType.Trade]: "💸",
  [ActivityType.Poap]: "🔮",
  [ActivityType.Post]: "📄",
  [ActivityType.Revise]: "💵",
  [ActivityType.Comment]: "💬",
  [ActivityType.Share]: "🏛️",
  [ActivityType.Profile]: "👤",
  [ActivityType.Follow]: "🤝",
  [ActivityType.Unfollow]: "🙅",
  [ActivityType.Like]: "❤️",
  [ActivityType.Propose]: "💵",
  [ActivityType.Vote]: "💰",
  [ActivityType.Launch]: "🏛️",
  [ActivityType.Donate]: "💌",
  [ActivityType.Approval]: "✅",
  [ActivityType.Edit]: "📝",
};
