import { createAction } from "@reduxjs/toolkit";
import { ProfileInterface } from "../../utils/types";

export const updateUniversalBatchedProfile = createAction<{ profiles: ProfileInterface[] }>(
  "universal/batch"
);
