"use client";
import useSWR from "swr";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis/degenscore";
import Image from "next/image";

function useDegenInfo(address: string) {
  const { data, error } = useSWR(`${DEGENSCORE_ENDPOINT}${address}`, DegenFetcher, {
    suspense: true,
    fallbackData: [],
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function WidgetDegenScore(props) {
  const { address } = props;
  const { data } = useDegenInfo(address);
  
  if (!data || !data.name) return null;
  return (
    <div className="profile-widget-full">
      <div className="profile-widget profile-widget-degenscore">
        <h2 className="profile-widget-title">
          <span className="emoji-large mr-2">🕹️</span>
          DegenScore <span className="label label-success ml-1">{data.properties?.DegenScore}</span>
        </h2>

        <div className="widgets-collection-list">
          {data.traits &&
            Object.keys(data.traits).map((x, idx) => {
              const item = data.traits[x];
              return <div key={idx}>{item.name}</div>;
            })}
        </div>
      </div>
    </div>
  );
}
