import { useQuery } from "@apollo/client";
import { ResultAccount } from "./ResultAccount";
import { Loading } from "../shared/Loading";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { GET_PROFILES_ENS } from "../../utils/queries";
import _ from 'lodash'

export const SearchResultEns = ({ searchTerm }) => {
  const { loading, error, data } = useQuery(GET_PROFILES_ENS, {
    variables: { ens: searchTerm },
  });
  
  if (loading) return <Loading />;
  if (error) return <Error text={error} />;
  if (!data?.nft) return <Empty />;

  const results = data?.nft.owner;
  let resultOwner = {
    identity: {
      uuid: results?.uuid,
      platform: results?.platform,
      identity: results?.identity,
      displayName: results?.displayName,
      nft: results?.nft,
    },
  };
  let resultNeighbor = [...results?.neighbor];
  resultNeighbor.unshift(resultOwner);
  resultNeighbor = resultNeighbor.filter(
    (ele, index) =>
      index ===
      resultNeighbor.findIndex(
        (elem) => elem.identity.uuid == ele.identity.uuid
      )
  );
  console.log(resultNeighbor);

  return results ? (
    <ResultAccount
      type="ens"
      searchTerm={searchTerm}
      resultNeighbor={resultNeighbor}
    />
  ) : (
    <Empty />
  );
};
