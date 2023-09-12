import { createAction } from "@reduxjs/toolkit";

export const updateUniversalBatchedProfile = createAction<{ profiles: any[] }>(
  "universal/batch"
);
