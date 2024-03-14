import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILES_QUERY } from "../../utils/queries";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";

export default function SearchResult({
  searchTerm,
  searchPlatform,
}) {
  const [getQuery, { loading, error, data }] = useLazyQuery(
    GET_PROFILES_QUERY,
    {
      variables: {
        platform: searchPlatform,
        identity: searchTerm,
      },
    }
  );
  const [resultNeighbor, setResultNeighbor] = useState([]);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    if (searchPlatform && searchTerm) {
      getQuery();
    }
    if (!data || !data.identity) return;
    const results = data?.identity;
    const resultOwner = {
      identity: {
        uuid: results?.uuid,
        uid: results?.uid,
        platform: results?.platform,
        identity: results?.identity,
        displayName: results?.displayName,
        ownedBy: results?.ownedBy,
        nft: results?.nft,
        reverse: results?.reverse
      },
    };
    if (results?.neighborWithTraversal) {
      const temp = results?.neighborWithTraversal.reduce((pre, cur) => {
        pre.push({
          identity: cur.from,
          sources: [cur.source],
          __typename: "IdentityWithSource",
        });
        pre.push({
          identity: cur.to,
          sources: [cur.source],
          __typename: "IdentityWithSource",
        });
        return pre;
      }, [resultOwner]);
      
      setResultNeighbor(
        temp.filter(
          (ele, index) =>
            index ===
            temp.findIndex((elem) => elem.identity.uuid == ele.identity.uuid)
        )
      );

      setGraphData(data.identity.neighborWithTraversal || []);
    }
  }, [data, searchPlatform, searchTerm, getQuery]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (!data?.identity) return <Empty />;

  return (
    <ResultAccount
      graphTitle={searchTerm}
      resultNeighbor={resultNeighbor}
      graphData={graphData}
    />
  );
}
