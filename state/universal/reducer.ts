import { createReducer } from "@reduxjs/toolkit";
import { PlatformType } from "../../utils/platform";
import { ProfileInterface } from "../../utils/profile";
import { updateUniversalBatchedProfile } from "./actions";

interface UserState {
  profiles: {
    [address: string]: Record<PlatformType, ProfileInterface>;
  };
}

export const initialState: UserState = {
  profiles: {},
};

export default createReducer(initialState, (builder) =>
  builder.addCase(
    updateUniversalBatchedProfile,
    (state, { payload: { profiles } }) => {
      profiles.map(
        (x) =>
          (state.profiles[x.address] = {
            ...state.profiles[x.address],
            [x.platform]: x,
          })
      );
    }
  )
);
