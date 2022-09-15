import { useQuery } from "@apollo/client";
import {
  GET_IDENTITY_GRAPH_DATA,
  GET_IDENTITY_GRAPH_ENS,
  GET_PROFILES_ENS,
} from "../../../utils/queries";

export const useGraph = (value, platform, type) => {
  return useQuery(
    type === "ens" ? GET_IDENTITY_GRAPH_ENS : GET_IDENTITY_GRAPH_DATA,
    {
      variables:
        type === "ens"
          ? {
              id: value,
            }
          : {
              platform,
              identity: value,
            },
    }
  );
};
