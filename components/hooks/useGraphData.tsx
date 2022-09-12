import { useQuery } from "@apollo/client";
import {
  GET_IDENTITY_GRAPH_DATA,
  GET_IDENTITY_GRAPH_DATA_ENS,
} from "../../utils/queries";

export const useGraphData = (value, platform, type) => {
  const { loading, error, data } = useQuery(
    type === "ens" ? GET_IDENTITY_GRAPH_DATA_ENS : GET_IDENTITY_GRAPH_DATA,
    {
      variables:
        type === "ens"
          ? {
              ens: value,
            }
          : {
              platform,
              value,
            },
    }
  );
  return { loading, error, data };
};
