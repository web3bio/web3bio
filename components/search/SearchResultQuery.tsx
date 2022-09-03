import { useQuery } from "@apollo/client";
import { ResultAccount } from "./ResultAccount";
import { Loading } from "../shared/Loading";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { GET_PROFILES_QUERY } from "../../utils/queries";

export const SearchResultQuery = ({ searchTerm, searchPlatform }) => {
  console.log(searchTerm, searchPlatform);
  const { loading, error, data } = useQuery(GET_PROFILES_QUERY, {
    variables: {
      platform: searchPlatform,
      identity: searchTerm,
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error text={error} />;

  const results = data?.identity;
  let resultOwner = {
      identity: {
        uuid: results?.uuid,
        platform: results?.platform,
        identity: results?.identity,
        displayName: results?.displayName,
        nft: results?.nft,
      },
    },
    resultNeighbor = [];
  if (results?.neighbor) {
    resultNeighbor = [...results?.neighbor];
  }
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
      searchPlatform={searchPlatform}
      searchTerm={searchTerm}
      resultNeighbor={resultNeighbor}
    />
  ) : (
    <Empty />
  );
};
