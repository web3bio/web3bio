import { useQuery } from "@apollo/client";
import { GET_IDENTITY_GRAPH_DATA, GET_IDENTITY_GRAPH_ENS } from "../../../utils/queries";

export const useGraph = (value, platform, type) => {
  const result =  useQuery(
    type === "ens" ? GET_IDENTITY_GRAPH_ENS : GET_IDENTITY_GRAPH_DATA,
    {
      variables:
        type === "ens"
          ? {
              ens: value,
            }
          : {
              platform,
              identity: value,
            },
    },
  );
  return result
};
