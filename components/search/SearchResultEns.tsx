import { useQuery } from "@apollo/client";
import { ResultAccount } from "./ResultAccount";
import { Loading } from "../shared/Loading";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { GET_PROFILES_ENS } from "../../utils/queries";
import _ from "lodash";
import { useEffect, useState } from "react";

export const SearchResultEns = ({ searchTerm }) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  });
  const [resultNeighbor, setResultNeighbor] = useState([]);

  useEffect(() => {
    if (!data || !data.nft) return;
    const results = data?.nft.owner;
    const resultOwner = {
      identity: {
        uuid: results?.uuid,
        platform: results?.platform,
        identity: results?.identity,
        displayName: results?.displayName,
        nft: results?.nft,
      },
    };

    const temp = [...results?.neighbor];
    temp.unshift(resultOwner);
    setResultNeighbor(
      temp.filter(
        (ele, index) =>
          index ===
          temp.findIndex(
            (elem) => elem.identity.uuid == ele.identity.uuid
          )
      )
    );
  }, [data]);

  
  if (loading) return <Loading />;
  if (error) return <Error text={error} />;
  if (!data?.nft) return <Empty />;
  return (
    <ResultAccount
      type="ens"
      searchTerm={searchTerm}
      resultNeighbor={resultNeighbor}
    />
  );
};
