import { useQuery } from "@apollo/client";
import { GET_IDENTITY_GRAPH_DATA } from "../../utils/queries";

export const useLinks = (platform: string, identity: string) => {
  const { loading, error, data } = useQuery(GET_IDENTITY_GRAPH_DATA, {
    variables: {
      platform,
      identity,
    },
  });
  const links = [];
  if (data) {
    const source = data.identity.neighborWithTraversal;
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
