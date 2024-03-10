import { createReducer } from "@reduxjs/toolkit";
import { ProfileInterface } from "../../utils/profile";
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
      profiles.map((x) => x.identity && (state.profiles[x.uuid] = x));
    }
  )
);
