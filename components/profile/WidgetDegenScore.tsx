"use client";
import useSWR from "swr";
import { DegenFetcher, DEGENSCORE_ENDPOINT } from "../apis/degenscore";
import Link from "next/link";
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
          DegenScore <span className="label ml-2">{data.properties?.DegenScore}</span>
          <Link className="action-icon" href={`https://degenscore.com/beacon/${address}`} target={"_blank"}>
            <SVG src="icons/icon-open.svg" width={24} height={24} />
          </Link>
        </h2>
        <div className="text-assistive">
        The DegenScore Beacon is an Ethereum soulbound token that highlights your on-chain skills & traits across one or more wallets.\nUse it to leverage your on-chain reputation in the DegenScore Cafe and across web3.
        </div>

        {data.traits.actions?.metadata.actions.actions && (
          <div className="widget-trait-list">
            {(data.traits.actions?.metadata.actions.actions).map((item, idx) => {
              return (
                <div 
                  key={idx} 
                  className={`trait-item ${item.actionTier?.toLowerCase()}`}
                  title={item.description}
                >
                  <div className="trait-item-bg">
                    <div className="trait-label">
                      {item.actionTier == "ACTION_TIER_LEGENDARY" && (
                        <div className="value">💎</div>
                      )}
                      {item.actionTier == "ACTION_TIER_EPIC" && (
                        <div className="value">&#127942;</div>
                      )}
                    </div>
                    <div className="trait-name">{item.name}</div>
                  </div>
                </div>
              );
            })}
        </div>
        )}
      </div>
    </div>
  );
}
