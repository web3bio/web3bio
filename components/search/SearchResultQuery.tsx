import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PROFILES_QUERY } from "../../utils/queries";
import { ResultGraph } from "../graph/ResultGraph";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";

export const SearchResultQuery = ({
  searchTerm,
  searchPlatform,
  openProfile,
}) => {
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
  const [open, setOpen] = useState(false);
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
        platform: results?.platform,
        identity: results?.identity,
        displayName: results?.displayName,
        ownedBy: results?.ownedBy,
        nft: results?.nft,
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
      }, []);
      temp.unshift(resultOwner);
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

  if (loading) return <Loading retry={()=>window.location.reload()} />;
  if (error) return <Error retry={getQuery} text={error} />;
  if (!data?.identity) return <Empty />;

  return (
    <>
      <ResultAccount
        openProfile={openProfile}
        searchTerm={searchTerm}
        resultNeighbor={resultNeighbor}
        graphData={graphData}
        openGraph={() => setOpen(true)}
      />
      {open && (
        <ResultGraph
          onClose={() => setOpen(false)}
          data={graphData}
          title={searchTerm}
        />
      )}
    </>
  );
};
