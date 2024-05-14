import { useSelector } from "react-redux";
import { GraphListProfileItem } from "./GraphListProfileItem";
import { AppState } from "../state";
import { ProfileInterface } from "../utils/profile";
import _ from "lodash";

export default function SocialGraphList(props) {
  const { data } = props;
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  return (
    <div
      className="graph-list-container"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {data?.nodes.map((x, idx) => {
        return (
          <GraphListProfileItem
            profile={profiles?.find((i) => i.uuid === x.uuid)}
            key={`list_item_${idx}`}
            uuid={x.uuid}
            identity={x.identity}
            platform={x.platform}
          />
        );
      })}
    </div>
  );
}
