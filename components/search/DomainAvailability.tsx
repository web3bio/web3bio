import { useLazyQuery } from "@apollo/client";
import { useEffect, useMemo } from "react";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { GET_AVAILABLE_DOMAINS } from "../utils/queries";
import { DomainAvailableItem } from "./DomainAvailabilityItem";
import _ from "lodash";

export default function SearchResult({ searchTerm }) {
  const [getQuery, { loading, error, data: domains }] = useLazyQuery(
    GET_AVAILABLE_DOMAINS,
    {
      variables: {
        name: searchTerm.split(".")[0],
      },
    }
  );

  useEffect(() => {
    if (searchTerm) {
      getQuery();
    }
  }, [searchTerm, getQuery]);

  const sortedData = useMemo(() => {
    return _.sortBy(
      domains?.domainAvailableSearch,
      (x) => !x.name.includes(searchTerm)
    );
  }, [domains?.domainAvailableSearch, searchTerm]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (searchTerm && domains?.domainAvailableSearch?.length === 0)
    return <Empty />;

  return (
    domains?.domainAvailableSearch?.length > 0 && (
      <div className="search-result search-availability-result">
        <div className="search-result-header">
          <div className="search-result-text text-gray">
            Check domain availability:
          </div>
        </div>
        <div className="search-result-body">
          {sortedData.map((item) => (
            <DomainAvailableItem data={item} key={item.name + item.platform} />
          ))}
        </div>
      </div>
    )
  );
}
