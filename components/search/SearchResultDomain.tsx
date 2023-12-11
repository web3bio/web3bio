import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILES_DOMAIN } from "../../utils/queries";
import { regexEns } from "../../utils/regexp";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";

interface ResultNeighbor {
  identity: string;
}
export default function RenderResultDomain({ searchTerm, searchPlatform }) {
  const [getQuery, { loading, error, data }] = useLazyQuery(
    GET_PROFILES_DOMAIN,
    {
      variables: {
        platform: searchPlatform,
        identity: searchTerm,
      },
    }
  );
  const [resultNeighbor, setResultNeighbor] = useState<Array<ResultNeighbor>>(
    []
  );
  useEffect(() => {
    if (searchTerm && searchPlatform) getQuery();
    if (!data || !data.domain) return;
    const owner = data?.domain.owner;
    const resolved = data?.domain.resolved;

    const tranversal = resolved?.neighborWithTraversal.reduce((pre, cur) => {
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
    }, []);
    const temp = [
      {
        identity: {
          uuid: owner?.uuid,
          platform: owner?.platform,
          identity: owner?.identity,
          displayName: owner?.displayName,
          reverse: owner?.reverse,
          nft: owner?.nft,
          isOwner: resolved.identity === owner.identity ? false : true,
        },
      },
      ...tranversal,
    ];
    if (
      searchTerm !== temp[0]?.identity?.displayName &&
      regexEns.test(searchTerm)
    ) {
      // as sub domain
      temp.unshift({
        identity: {
          uuid: undefined,
          platform: resolved?.platform,
          identity: resolved?.identity,
          displayName: searchTerm,
          reverse: false,
          nft: [],
        },
      });
    }

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
    data.domain.resolved.neighborWithTraversal.length > 0
      ? data.domain.resolved.neighborWithTraversal
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
      resultNeighbor={resultNeighbor}
      graphData={graphData}
      graphTitle={searchTerm}
    />
  );
}
