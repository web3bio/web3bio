import { useQuery } from "@apollo/client";
import {
  GET_IDENTITY_GRAPH_DATA,
  GET_IDENTITY_GRAPH_DATA_ENS,
} from "../../utils/queries";

export const useLinks = (platform: string, identity: string, type?: string) => {
  const { loading, error, data } = useQuery(
    type === "ens" ? GET_IDENTITY_GRAPH_DATA_ENS : GET_IDENTITY_GRAPH_DATA,
    {
      variables:
        type === "ens"
          ? {
              ens: identity,
            }
          : {
              platform,
              identity,
            },
    }
  );
  const links = [];
  if (data) {
    const source =
      type === "ens"
        ? data.nft.owner.neighborWithTraversal
        : data.identity.neighborWithTraversal;
    if (source) {
      source.map((x) => {
        links.push({
          source: x.from.uuid,
          target: x.to.uuid,
          type: x.source,
          id: `${x.from.uuid}-${x.to.uuid}`,
        });
      });
    }
  }

  return { links, loading, error };
};
