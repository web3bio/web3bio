"use client";
import useSWR from "swr";
import { DegenFetcher, DEGEN_END_POINT } from "../apis/degen";
import Image from "next/image";

function useDegenInfo(address: string) {
  const { data, error } = useSWR(`${DEGEN_END_POINT}${address}`, DegenFetcher, {
    suspense: true,
    fallbackData: [],
  });
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export default function WidgetDegen(props) {
  const { address } = props;
  const { data } = useDegenInfo(address);

  if (!data || !data.name) return null;
  return (
    <div className="profile-widget-full">
      <div className="profile-widget">
        <h2 className="profile-widget-title">
          <div className="platform-icon mr-2">
            <Image width={24} height={24} src={data.image} alt="beacon" />
          </div>
          Beacon Score: {data.properties?.DegenScore}
        </h2>

        <div className="widgets-collection-list noscrollbar">
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
