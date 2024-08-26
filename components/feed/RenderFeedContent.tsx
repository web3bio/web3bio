import { useMemo } from "react";
import { ActivityTag, ActivityType } from "../utils/activity";
import _ from "lodash";
import FeedActionCard from "./FeedActionCard";

const resolveDuplicatedActions = (
  actions,
  id,
  specificTypes,
  isMetadataAction?
) => {
  const _data = JSON.parse(JSON.stringify(actions));
  const duplicatedObjects = new Array();
  _data.forEach((x, idx) => {
    const shouldReturnDup = (i, x) => {
      if (x.tag === ActivityTag.collectible && x.type === ActivityType.trade) {
        return (
          i.platform === x.platform &&
          i.metadata?.address === x.metadata.address &&
          i.metadata?.action === x.metadata.action
        );
      }
      return (
        i.tag === x.tag &&
        i.type === x.type &&
        i.from === x.from &&
        i.to === x.to &&
        specificTypes.includes(isMetadataAction ? i.metadata.action : i.type)
      );
    };
    const dupIndex = duplicatedObjects.findIndex((i) => shouldReturnDup(i, x));
    if (dupIndex === -1) {
      duplicatedObjects.push({
        ...x,
        duplicatedObjects: [x.metadata],
        action_id: id + idx,
      });
    } else {
      duplicatedObjects[dupIndex].duplicatedObjects.push(x.metadata);
    }
  });

  return duplicatedObjects;
};

export const RenderFeedContent = (props) => {
  const {
    actions,
    tag,
    openModal,
    network,
    id,
    platform,
    owner,
    feed,
    nftInfos,
  } = props;
  const comProps = useMemo(() => {
    switch (tag) {
      case "social":
        return {
          overridePlatform: feed.platform,
          platform,
          openModal,
          actions: resolveDuplicatedActions(
            actions,
            id,
            ["renew", "update"],
            true
          ),
        };
      case "exchange":
      case "transaction":
        return {
          id,
          network,
          openModal,
          owner,
          actions: resolveDuplicatedActions(actions, id, [
            ActivityType.transfer,
          ]),
        };
      case "collectible":
        return {
          id,
          network,
          openModal,
          nftInfos,
          actions: resolveDuplicatedActions(actions, id, [
            ActivityType.mint,
            ActivityType.trade,
            ActivityType.transfer,
          ]),
          owner,
        };
      default:
        return {
          id,
          actions,
        };
    }
  }, [tag, nftInfos]);

  return <FeedActionCard tag={tag} key={actions.id} {...comProps} />;
};
