import { createReducer } from "@reduxjs/toolkit";
import { ProfileInterface } from "../../utils/types";
import { updateUniversalBatchedProfile } from "./actions";

interface UserState {
  profiles: {
    [uuid: string]: ProfileInterface;
  };
}

export const initialState: UserState = {
  profiles: {},
};

export default createReducer(initialState, (builder) =>
  builder.addCase(
    updateUniversalBatchedProfile,
    (state, { payload: { profiles } }) => {
      profiles.forEach(
        (x) =>
          x.identity &&
          (state.profiles[x.uuid || `${x.platform}_${x.identity}`] = x)
      );
    }
  )
);
