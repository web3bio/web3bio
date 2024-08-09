import { useSelector } from "react-redux";
import { AppState } from "../state";
import { ProfileInterface } from "../utils/types";
import _ from "lodash";

export const useProfiles = () => {
  const cached = useSelector<AppState, { [address: string]: ProfileInterface }>(
    (state) => state.universal.profiles
  );
  const profiles = _.flatten(Object.values(cached).map((x) => x));
  return profiles;
};
