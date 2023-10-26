import { Tag } from "./types";
export const RSS3_ENDPOINT = "https://testnet.rss3.io/";
export const RSS3Fetcher = async (url, options?) => {
  try {
    const res = await fetch(url, options).then((r) => r.json());
    return res;
  } catch {
    return null;
  }
};

export const FeedEmojiMapByTag = {
  [Tag.Social]: "💬",
  [Tag.Collectible]: "🌃",
  [Tag.Donation]: "💌",
  [Tag.Exchange]: "💵",
  [Tag.Transaction]: "💰",
  [Tag.Governance]: "🏛️",
  [Tag.MetaVerse]: "👽",
};
