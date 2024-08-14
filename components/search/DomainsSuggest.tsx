import { useLazyQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { GET_AVAILABLE_DOMAINS } from "../utils/queries";
import { DomainAvailableItem } from "./DomainAvailableItem";
import _ from "lodash";
import { useRouter } from "next/navigation";

export default function SearchResult({ searchTerm }) {
  const [getQuery, { loading, error, data: domains }] = useLazyQuery(
    GET_AVAILABLE_DOMAINS,
    {
      variables: {
        name: searchTerm.split(".")[0],
      },
    }
  );
  const router = useRouter();

  useEffect(() => {
    if (searchTerm) {
      getQuery();
    }
  }, [searchTerm, getQuery]);
  const sortedData = useMemo(() => {
    return _.sortBy(
      domains?.domainAvailableSearch,
      (x) => x.name !== searchTerm
    );
  }, [domains?.domainAvailableSearch]);
  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (searchTerm && !sortedData?.length) return <Empty />;
  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="search-result-text text-gray">
          Available Domains results:
        </div>
        <div
          className="btn btn-primary"
          onClick={() => {
            router.push("/?s=" + searchTerm);
          }}
        >
          Back to Search
        </div>
      </div>

      <div className="search-result-body">
        {sortedData.map((item, idx) => (
          <DomainAvailableItem data={item} key={item.name + idx} />
        ))}
      </div>
    </div>
  );
}
