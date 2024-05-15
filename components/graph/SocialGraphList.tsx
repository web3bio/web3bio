import { useSelector } from "react-redux";
import { GraphListProfileItem } from "./GraphListProfileItem";
import { AppState } from "../state";
import { ProfileInterface } from "../utils/profile";
import _ from "lodash";
import { useMemo } from "react";
import { SocialRelationEnum } from "./utils";

export default function SocialGraphList(props) {
  const { data } = props;
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));

  const renderData = useMemo(() => {
    const res = new Array();
    data.nodes
      .filter((x) => !x.root)
      .forEach((x) => {
        x.relations = [];
        const asFollower = data.edges.find(
          (i) => i.source === x.id && i.type === SocialRelationEnum.follower
        );
        const asFollowedBy = data.edges.find(
          (i) => i.target === x.id && i.type === SocialRelationEnum.following
        );
        if (asFollowedBy && !asFollower) {
          x.relations.push({
            key: x.platform,
            action: SocialRelationEnum.following,
          });
        }
        if (!asFollowedBy && asFollower) {
          x.relations.push({
            key: x.platform,
            action: SocialRelationEnum.follower,
          });
        }
        if (asFollowedBy && asFollower) {
          x.relations.push({
            key: x.platform,
            action: SocialRelationEnum.mutual_follow,
          });
        }
        res.push(x);
      });
    return res;
  }, [data]);

  return (
    <div
      className="graph-list-container"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {renderData.map((x, idx) => {
        return (
          <GraphListProfileItem
            profile={profiles?.find((i) => i.uuid === x.uuid)}
            key={`list_item_${idx}`}
            uuid={x.uuid}
            identity={x.identity}
            platform={x.platform}
            relations={x.relations}
          />
        );
      })}
    </div>
  );
}
