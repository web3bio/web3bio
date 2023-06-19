import { memo, useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { PlatformType } from "../../utils/platform";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
const useArticles = (address: string) => {
  const { data, error } = useSWR<any>(
    `${RSS3_END_POINT}notes/${address}?limit=500&platform=${PlatformType.mirror}&include_poap=false&count_only=false&query_status=false`,
    RSS3Fetcher
  );
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};
const RenderMirrorWidget = (props) => {
  const { address } = props;
  const { data, isLoading } = useArticles(address);
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    if (data?.result) {
      setArticles(Array.from(data.result));
    }
  }, [data]);
  if (!articles || isLoading) return null;
  return (
    <div className="profile-widget-full profile-widget profile-widget-nft">
      <h2 className="profile-widget-title">
        <span className="emoji-large mr-2">📖</span>
        Articles
      </h2>
      {articles.map((x, idx) => {
        console.log("article", x.actions[0]);
        return (
          <div key={idx}>
            {idx + 1}: {x.actions?.[0].metadata.title}
          </div>
        );
      })}
    </div>
  );
};

export const MirrorWidget = memo(RenderMirrorWidget);
