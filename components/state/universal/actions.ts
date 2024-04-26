import { createAction } from "@reduxjs/toolkit";
import { ProfileInterface } from "../../utils/profile";

export const updateUniversalBatchedProfile = createAction<{ profiles: ProfileInterface[] }>(
  "universal/batch"
);
