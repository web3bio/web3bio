import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILES_DOMAIN } from "../../utils/queries";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";
export default function RenderResultDomain({
  searchTerm,
  searchPlatform,
  onItemClick,
}) {
  const [getQuery, { loading, error, data }] = useLazyQuery(
    GET_PROFILES_DOMAIN,
    {
      variables: {
        platform: searchPlatform,
        identity: searchTerm,
      },
    }
  );
  const [resultNeighbor, setResultNeighbor] = useState([]);
  useEffect(() => {
    if (searchTerm && searchPlatform) getQuery();
    if (!data || !data.domain) return;
    const results = data?.domain.owner;

    const temp = results?.neighborWithTraversal.reduce(
      (pre, cur) => {
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
      },
      [
        {
          identity: {
            uuid: results?.uuid,
            platform: results?.platform,
            identity: results?.identity,
            displayName: results?.displayName,
            nft: results?.nft,
          },
        },
      ]
    );
    setResultNeighbor(
      temp.filter(
        (ele, index) =>
          index ===
          temp.findIndex((elem) => elem.identity.uuid == ele.identity.uuid)
      )
    );
  }, [data, searchTerm, searchPlatform, getQuery]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (!data?.domain) return <Empty />;
  const graphData =
    data.domain.owner.neighborWithTraversal.length > 0
      ? data.domain.owner.neighborWithTraversal
      : resultNeighbor.length > 0
      ? [
          {
            from: resultNeighbor[0].identity,
            to: resultNeighbor[0].identity,
            source: "nextid",
          },
        ]
      : [];

  return (
    <ResultAccount
      onItemClick={onItemClick}
      resultNeighbor={resultNeighbor}
      graphData={graphData}
      graphTitle={searchTerm}
    />
  );
}
