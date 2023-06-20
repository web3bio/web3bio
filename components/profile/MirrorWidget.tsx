import { memo, useEffect, useState } from "react";
import useSWR from "swr";
import { PlatformType } from "../../utils/platform";
import { RSS3Fetcher, RSS3_END_POINT } from "../apis/rss3";
import Markdown from "react-markdown";

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
      console.log(data, "kkk");
      setArticles(
        data.result?.map((x) => {
          return {
            ...x.actions?.[0],
            date: x.timestamp,
          };
        })
      );
    }
  }, [data]);
  if (!articles || isLoading) return null;
  return (
    <div className="profile-widget-full ">
      <div className="profile-widget profile-widget-nft" style={{
        maxHeight:'20rem',
        overflowY:'auto'
      }} >
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">📖</span>
          Articles
        </h2>
        {articles?.map((x, idx) => {
          return (
            <div key={`${idx}${x?.metadata.title}`}>
              <div className="article-title">
                <p>
                  {idx + 1}: {x?.metadata.title}
                </p>
                <p>{x.date}</p>
              </div>
              {/*Content Here*/}
              <Markdown className="markdown" >{x?.metadata.body}</Markdown>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const MirrorWidget = memo(RenderMirrorWidget);
