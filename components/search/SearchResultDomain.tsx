import { useQuery } from "@apollo/client";
import { ResultAccount } from "./ResultAccount";
import { Loading } from "../shared/Loading";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { GET_PROFILES_DOMAIN } from "../../utils/queries";
import _ from "lodash";
import { memo, useEffect, useState } from "react";
const RenderResultDomain = ({ searchTerm, searchPlatform }) => {
  const { loading, error, data } = useQuery(GET_PROFILES_DOMAIN, {
    variables: {
      platform: searchPlatform,
      identity: searchTerm,
    },
  });
  const [resultNeighbor, setResultNeighbor] = useState([]);
  useEffect(() => {
    if (!data || !data.domain) return;
    const results = data?.domain.owner;
    const resultOwner = {
      identity: {
        uuid: results?.uuid,
        platform: results?.platform,
        identity: results?.identity,
        displayName: results?.displayName,
        nft: results?.nft,
      },
    };

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
  }, [data, searchTerm]);
  if (loading) return <Loading />;
  if (error) return <Error text={error} />;
  if (!data?.domain) return <Empty />;

  return (
    <ResultAccount
      searchTerm={searchTerm}
      resultNeighbor={resultNeighbor}
      graphData={
        data.domain.owner.neighborWithTraversal.length
          ? data.domain.owner.neighborWithTraversal
          : [
              resultNeighbor.length > 0
                ? {
                    from: resultNeighbor[0].identity,
                    to: resultNeighbor[0].identity,
                    source: "nextid",
                  }
                : {},
            ]
      }
    />
  );
};

export const SearchResultDomain = memo(RenderResultDomain);
