"use client";
import useSWR from "swr";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis/degenscore";
import SVG from "react-inlinesvg";

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
          <div className="platform-icon mr-2">
            <SVG src={`../icons/icon-degenscore.svg`} fill={"#c084fc"} width={32} height={32} />
          </div>
          DegenScore <span className="label ml-1" style={{"background": "#c084fc"}}>{data.properties?.DegenScore}</span>
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
