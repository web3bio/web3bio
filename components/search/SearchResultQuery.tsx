import { useQuery } from "@apollo/client";
import { ResultAccount } from "./ResultAccount";
import { Loading } from "../shared/Loading";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { GET_PROFILES_QUERY } from "../../utils/queries";
import { useEffect, useState } from "react";

export const SearchResultQuery = ({
  searchTerm,
  searchPlatform,
  openProfile,
}) => {
  const { loading, error, data } = useQuery(GET_PROFILES_QUERY, {
    variables: {
      platform: searchPlatform,
      identity: searchTerm,
    },
  });
  const [resultNeighbor, setResultNeighbor] = useState([]);

  useEffect(() => {
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
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <Error text={error} />;
  if (!data?.identity) return <Empty />;

  return (
    <ResultAccount
      openProfile={openProfile}
      searchTerm={searchTerm}
      resultNeighbor={resultNeighbor}
      graphData={data.identity.neighborWithTraversal || []}
    />
  );
};
