import { DocumentNode, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Empty } from "../shared/Empty";
import { Error } from "../shared/Error";
import { Loading } from "../shared/Loading";
import { ResultAccount } from "./ResultAccount";
import { getProfileQuery } from "../utils/queries";
import Link from "next/link";
import SVG from "react-inlinesvg";

export default function SearchResult({ searchTerm, searchPlatform }) {
  const [getQuery, { loading, error, data }] = useLazyQuery(getProfileQuery() as DocumentNode, {
    variables: {
      platform: searchPlatform,
      identity: searchTerm,
    },
  });
  const [identityGraphData, setIdentityGraphData] = useState<any>(null);

  useEffect(() => {
    if (searchPlatform && searchTerm) {
      getQuery();
    }
    if (!data || !data.identity) return;
    setIdentityGraphData(data.identity.identityGraph);
  }, [data, searchPlatform, searchTerm, getQuery]);

  if (loading)
    return (
      <Loading
        placeholder="Fetching information..."
        retry={() => window.location.reload()}
      />
    );
  if (error) return <Error retry={getQuery} text={error} />;
  if (searchTerm && !data?.identity) 
    return (
      <Empty>
        <button className="btn" onClick={() => window.history.back()}>Go back</button>
        <Link href={`/?domain=${searchTerm}`} className="btn btn-primary"><SVG src={"icons/icon-suggestion.svg"} width={20} height={20} /> Check availability</Link>
      </Empty>
    );
    
  return (
    data?.identity && (
      <ResultAccount
        identityGraph={{
          nodes:
            identityGraphData?.vertices?.length > 0
              ? identityGraphData?.vertices.map((x) => ({
                  ...x,
                  id: x.platform + "," + x.identity,
                }))
              : [{ ...data?.identity }],
          edges: identityGraphData?.edges || [],
        }}
        platform={searchPlatform}
        graphTitle={searchTerm}
      />
    )
  );
}
