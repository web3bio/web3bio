import { resolveIPFS_URL } from "./ipfs";
import { isSameAddress, isValidEthereumAddress } from "./utils";

export enum ActivityTag {
  collectible = "collectible",
  exchange = "exchange",
  social = "social",
  rss = "rss",
  metaverse = "metaverse",
  transaction = "transaction",
  unknown = "unknown",
}

export enum ActivityType {
  approval = "approval",
  bridge = "bridge",
  burn = "burn",
  comment = "comment",
  delete = "delete",
  liquidity = "liquidity",
  mint = "mint",
  post = "post",
  profile = "profile",
  proxy = "proxy",
  revise = "revise",
  reward = "reward",
  share = "share",
  staking = "staking",
  swap = "swap",
  trade = "trade",
  transfer = "transfer",
  // new
  feed = "feed",
  unknown = "unknown",
}

export const ActivityTypeData: { [key in ActivityType]: any } = {
  [ActivityType.approval]: {
    key: ActivityType.approval,
    emoji: "✅",
    label: "Approval",
    action: {
      default: "Approved",
      approve: "Approved",
      revoke: "Revoked the approval of",
    },
    prep: "on",
  },
  [ActivityType.bridge]: {
    key: ActivityType.bridge,
    emoji: "🌉",
    label: "Bridge",
    action: {
      default: "Bridged",
      deposit: "Deposited",
      withdraw: "Withdrawn",
    },
    prep: "",
  },
  [ActivityType.burn]: {
    key: ActivityType.burn,
    emoji: "🔥",
    label: "Burn",
    action: {
      default: "Burnt",
    },
    prep: "",
  },

  [ActivityType.comment]: {
    key: ActivityType.comment,
    emoji: "💬",
    label: "Comment",
    action: {
      default: " ",
    },
    prep: "",
  },
  [ActivityType.delete]: {
    key: ActivityType.delete,
    emoji: "🗑️",
    label: "Delete",
    action: {
      default: "Deleted",
    },
    prep: "",
  },

  [ActivityType.liquidity]: {
    key: ActivityType.liquidity,
    emoji: "🏦",
    label: "Liquidity",
    action: {
      default: "Staked",
      add: "Staked",
      remove: "Unstaked",
      withdraw: "Withdrawn",
      supply: "Supplied",
      borrow: "Borrowed",
      repay: "Repaid",
      collect: "Received",
    },
    prep: "",
  },

  [ActivityType.mint]: {
    key: ActivityType.mint,
    emoji: "🖼️",
    label: "Mint",
    action: {
      default: "Minted",
      post: "Minted a post",
    },
    prep: "",
  },

  [ActivityType.post]: {
    key: ActivityType.post,
    emoji: "📄",
    label: "Post",
    action: {
      default: " ",
    },
    prep: "to",
  },
  [ActivityType.profile]: {
    key: ActivityType.profile,
    emoji: "👤",
    label: "Profile",
    action: {
      default: "",
      delete: "Deleted the record on profile",
      update: "Updated the profile",
      create: "Created the profile",
      renew: "Renewed the domain",
      wrap: "Wrapped the domain",
    },
    prep: "",
  },
  [ActivityType.proxy]: {
    key: ActivityType.proxy,
    emoji: "🔮",
    label: "Proxy",
    action: {
      default: "",
      appoint: "Approved a proxy",
    },
    prep: "",
  },
  [ActivityType.revise]: {
    key: ActivityType.revise,
    emoji: "✍🏻",
    label: "Revise",
    action: {
      default: "Saved a revision for an article",
    },
    prep: "",
  },
  [ActivityType.reward]: {
    key: ActivityType.reward,
    emoji: "🍬",
    label: "Reward",
    action: {
      default: "Rewarded",
    },
    prep: "",
  },
  [ActivityType.share]: {
    key: ActivityType.share,
    emoji: "🔁",
    label: "Share",
    action: {
      default: "Shared a post",
    },
    prep: "",
  },
  [ActivityType.staking]: {
    key: ActivityType.staking,
    emoji: "🏦",
    label: "Staking",
    action: {
      default: "Staked",
      claim: "Claimed",
      unstake: "Unstaked",
    },
    prep: "",
  },
  [ActivityType.swap]: {
    key: ActivityType.swap,
    emoji: "💵",
    label: "Swap",
    action: {
      default: "Swapped",
    },
    prep: "for",
  },
  [ActivityType.trade]: {
    key: ActivityType.trade,
    emoji: "⚖️",
    label: "Trade",
    action: {
      default: "Traded",
      buy: "Bought",
      sell: "Sold",
      offer: "Made an offer for",
    },
    prep: "",
  },
  [ActivityType.transfer]: {
    key: ActivityType.transfer,
    emoji: "💵",
    label: "Transfer",
    action: {
      default: "Transferred",
      receive: "Received",
    },
    prep: "to",
  },
  // todo: fulfill feed
  [ActivityType.feed]: {
    key: ActivityType.feed,
    emoji: "🌲",
    label: "Feed",
    action: {
      default: "temp",
      receive: "temp",
    },
    prep: "",
  },
  [ActivityType.unknown]: {
    key: ActivityType.unknown,
    emoji: "👽",
    label: "Unknown",
    action: {
      default: "Did something unknown",
    },
    prep: "",
  },
};

export const ActionStructMapping = (action, owner) => {
  let verb,
    objects,
    prep,
    target,
    platform,
    attachments = null as any;
  const isOwner = isSameAddress(action.to, owner);
  const metadata = action.metadata;

  switch (action.type) {
    // finance
    case ActivityType.approval:
      break;
    case ActivityType.transfer:
      verb = isOwner
        ? ActivityTypeData[ActivityType.transfer].action.receive
        : ActivityTypeData[ActivityType.transfer].action.default;
      objects = action.duplicatedObjects || [metadata];
      prep = isOwner
        ? null
        : isValidEthereumAddress(action.to)
        ? ActivityTypeData[ActivityType.transfer].prep
        : null;
      target = isOwner
        ? null
        : isValidEthereumAddress(action.to)
        ? action.to
        : null;
      platform = action.platform;
      break;
    case ActivityType.liquidity:
      verb =
        ActivityTypeData[ActivityType.liquidity].action[
          metadata.action || "default"
        ];
      objects = metadata.tokens;
      platform = action.platform;
      break;
    case ActivityType.swap:
      verb = ActivityTypeData[ActivityType.swap].action.default;
      objects = [
        metadata.from,
        { text: ActivityTypeData[ActivityType.swap].prep },
        metadata.to,
      ];
      platform = action.platform;
      break;
    case ActivityType.bridge:
      verb =
        ActivityTypeData[ActivityType.bridge].action[
          metadata.action || "default"
        ];
      objects = [metadata.token];
      platform = action.platform;
      break;
    case ActivityType.burn:
      verb = ActivityTypeData[ActivityType.burn].action.default;
      objects = action.duplicatedObjects;
      platform = action.platform;
      break;
    // social
    case ActivityType.profile:
      verb =
        ActivityTypeData[action.type].action[
          metadata.key && !metadata?.value
            ? "delete"
            : metadata.action || "default"
        ];
      objects =
        metadata.action === "renew"
          ? action.duplicatedObjects.map((x) => ({ identity: x.handle }))
          : metadata.handle
          ? [{ identity: metadata.handle }]
          : [];
      platform = action.platform;
      attachments = {
        profiles: action.duplicatedObjects
          ?.filter((x) => x.key)
          .map((x) => ({
            key: x.key,
            value: x.value,
            url: action.related_urls?.[0] || `https://web3.bio/${x.handle}`,
          })),
      };
      break;
    case ActivityType.post:
    case ActivityType.comment:
    case ActivityType.share:
      verb = metadata.body
        ? metadata.body
        : ActivityTypeData[action.type].action[metadata.action || "default"];

      platform = action.type === ActivityType.share && action.platform;
      const article =
        ["Mirror"].includes(platform) || metadata.summary ? metadata : null;

      attachments = {
        targets: [],
        medias: metadata.media,
      };
      if (metadata.target) {
        attachments.targets.push({
          identity: metadata.target?.handle,
          url: resolveIPFS_URL(action.metadata.target_url),
          content: metadata.target?.body,
          media: metadata.target?.media,
        });
      }
      if (article) {
        attachments.targets.unshift({
          article,
          name: article.title,
          content: article.body,
        });
      }
      break;
    // collectible
    case ActivityType.trade:
    case ActivityType.mint:
      if (action.tag === ActivityTag.social) {
        verb = ActivityTypeMapping(action.type).action["post"];
        platform = action.platform;
        attachments = {
          targets: [
            {
              identity: metadata.handle,
              url: action.related_urls[0],
              content: metadata.body,
              media: metadata.media,
            },
          ],
        };
        break;
      }
      verb = ActivityTypeData[action.type].action[metadata.action || "default"];
      objects = action.duplicatedObjects || [metadata];
      platform = action.platform;
      attachments = {
        medias: (action.duplicatedObjects || [metadata]).filter(
          (x) => [1155, 721].includes(x.standard) && x.image_url
        ),
      };
      break;
    default:
      verb = ActivityTypeData[action.type].action[metadata.action || "default"];
      platform = action.platform;
      break;
  }

  return {
    verb,
    objects,
    prep,
    target,
    platform,
    attachments,
  };
};

export interface ActivityTypeData {
  key: string;
  emoji: string;
  label: string;
  action: Object;
  prep: string;
}

export const TagsFilterMapping = {
  ["all"]: {
    label: "All Feeds",
    filters: [],
    types: [
      ActivityType.bridge,
      ActivityType.comment,
      ActivityType.liquidity,
      ActivityType.mint,
      ActivityType.post,
      ActivityType.profile,
      ActivityType.share,
      ActivityType.swap,
      ActivityType.trade,
      ActivityType.transfer,
    ],
  },
  ["social"]: {
    label: "Social",
    filters: [ActivityTag.social],
    types: [
      ActivityType.comment,
      ActivityType.mint,
      ActivityType.post,
      ActivityType.profile,
      ActivityType.share,
    ],
  },
  ["finance"]: {
    label: "Finance",
    filters: [ActivityTag.transaction, ActivityTag.exchange],
    types: [
      ActivityType.bridge,
      ActivityType.liquidity,
      ActivityType.mint,
      ActivityType.swap,
      ActivityType.transfer,
      ActivityType.burn,
    ],
  },
  ["collectibles"]: {
    label: "Collectibles",
    filters: [ActivityTag.collectible, ActivityTag.metaverse],
    types: [
      ActivityType.mint,
      ActivityType.trade,
      ActivityType.transfer,
      ActivityType.burn,
    ],
  },
};

export const ActivityTypeMapping = (type: ActivityType) => {
  return (
    ActivityTypeData[type] ?? {
      key: type,
      emoji: "",
      label: type,
      action: [],
      prep: "",
    }
  );
};
