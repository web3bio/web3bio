import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { GET_AVAILABLE_DOMAINS } from "../utils/queries";
import { DomainAvailableItem } from "./DomainAvailableItem";

export default function SearchResult({ searchTerm }) {
  const [getQuery, { loading, error, data: domains }] = useLazyQuery(
    GET_AVAILABLE_DOMAINS,
    {
      variables: {
        name: searchTerm,
      },
    }
  );

  useEffect(() => {
    if (searchTerm) {
      getQuery();
    }
  }, [searchTerm, getQuery]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (searchTerm && !domains?.domainAvailableSearch?.length) return <Empty />;
  return (
    <div className="search-result">
      <div className="search-result-header">
        <div className="search-result-text text-gray">
          Available Domains results:
        </div>
      </div>
      <div className="search-result-body">
        {domains?.domainAvailableSearch.map((item, idx) => (
          <DomainAvailableItem data={item} key={item.name + idx} />
        ))}
      </div>
    </div>
  );
}
