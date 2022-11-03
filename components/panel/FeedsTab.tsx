import { memo } from "react";
import useSWR from "swr";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import { Empty } from "../shared/Empty";
import { Loading } from "../shared/Loading";
import { Error } from "../shared/Error";

function useFeeds(address: string) {
  const { data, error } = useSWR<any>(
    RSS3_END_POINT +
      `notes/${address}?limit=50&include_poap=false&count_only=false&query_status=false`,
    RSS3Fetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}
const RenderFeedsTab = (props) => {
  const { address,identity } = props;
  const { data, isLoading, isError } = useFeeds(identity.identity);
  if (isLoading) return <Loading />;
  if (isError) return <Error text={isError} />;
  if (!data || !data.result) return <Empty />;

  console.log("Feeds from rss3:", data);
  return (
    <div className="feeds-container-box">
      <div>Feeds See FUll DETAIL in Console</div>
      <div className="feeds-container">
        {data.result.map((x, idx) => {
          return (
            <div key={idx} style={{ borderBottom: "1px solid black" }}>
              <ul>
                <li>owner: {x.owner}</li>
                <li>tag: {x.tag}</li>
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const FeedsTab = memo(RenderFeedsTab);
