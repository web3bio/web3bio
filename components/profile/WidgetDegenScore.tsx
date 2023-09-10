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
            <SVG src={`../icons/icon-degenscore.svg`} fill={"#a855f7"} width={32} height={32} />
          </div>
          DegenScore <span className="label ml-1" style={{"background": "#a855f7", "color": "#fff"}}>{data.properties?.DegenScore}</span>
        </h2>

        <div className="widget-trait-list noscrollbar">
          {data.traits &&
            Object.keys(data.traits).map((x, idx) => {
              const item = data.traits[x];
          
              return (
                <div 
                  key={idx} 
                  className={`trait-item ${x} ${item.rarity.toLowerCase()}`}
                  title={item.description}
                >
                  <div className="trait-item-bg">
                    <div className={`trait-label ${item.valueType.toLowerCase()}_${item.value}`}>
                      {item.valueType == "TRAIT_VALUE_TYPE_SCORE" && (
                        <div className="value">{item.value}</div>
                      )}
                      {item.rarity == "TRAIT_RARITY_LEGENDARY" && (
                        <div className="value">💎</div>
                      )}
                      {item.rarity == "TRAIT_RARITY_EPIC" && (
                        <div className="value">&#127942;</div>
                      )}
                    </div>
                    <div className="trait-name">{item.name}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
